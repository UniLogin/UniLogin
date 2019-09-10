import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, getWallets, loadFixture} from 'ethereum-waffle';
import {constants, utils, providers, Wallet, Contract} from 'ethers';
import WalletContract from '../../../build/Wallet.json';
import {transferMessage, failedTransferMessage, callMessage, failedCallMessage, executeSetRequiredSignatures, executeAddKey} from '../../helpers/ExampleMessages';
import walletAndProxy from '../../fixtures/walletAndProxy';
import {calculateMessageHash, calculateMessageSignature, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, TEST_ACCOUNT_ADDRESS, UnsignedMessage, signString, createKeyPair} from '@universal-login/commons';
import {DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../../lib/defaultPaymentOptions';
import {getExecutionArgs} from '../../helpers/argumentsEncoding';
import {walletContractFixture} from '../../fixtures/walletContract';

chai.use(chaiAsPromised);
chai.use(solidity);

const {parseEther} = utils;

describe('WalletContract', async () => {
  let provider: providers.Provider;
  let walletContractProxy: Contract;
  let proxyAsWalletContract: Contract;
  let privateKey: string;
  let mockToken: Contract;
  let mockContract: Contract;
  let wallet: Wallet;
  let executeSignedFunc: any;
  let msg: UnsignedMessage;
  let signature: string;
  let data: string;
  let anotherWallet;
  let invalidSignature: string;
  let relayerBalance: utils.BigNumber;
  let relayerTokenBalance: utils.BigNumber;
  let publicKey: string;

  beforeEach(async () => {
    ({provider, publicKey, walletContractProxy, proxyAsWalletContract, privateKey, mockToken, mockContract, wallet} = await loadFixture(walletAndProxy));
    executeSignedFunc = new utils.Interface(WalletContract.interface).functions.executeSigned;
    msg = {...transferMessage, from: walletContractProxy.address};
    signature = calculateMessageSignature(privateKey, msg);
    data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
    [anotherWallet] = await getWallets(provider);
    invalidSignature = calculateMessageSignature(anotherWallet.privateKey, msg);
    relayerBalance = await wallet.getBalance();
    relayerTokenBalance = await mockToken.balanceOf(wallet.address);
  });

  it('properly construct', async () => {
    expect(await proxyAsWalletContract.lastNonce()).to.eq(0);
  });

  describe('Signing', () => {
    it('initial key exist', async () => {
      expect(await proxyAsWalletContract.keyExist(publicKey)).to.be.true;
    });

    it('zero key does not exist', async () => {
      expect(await proxyAsWalletContract.keyExist(constants.AddressZero)).to.be.false;
    });

    it('calculates hash', async () => {
      const jsHash = calculateMessageHash(msg);
      const solidityHash = await proxyAsWalletContract.calculateMessageHash(
        msg.from,
        msg.to,
        msg.value,
        msg.data,
        msg.nonce,
        msg.gasPrice,
        msg.gasToken,
        msg.gasLimit);
      expect(jsHash).to.eq(solidityHash);
    });

    it('recovers signature', async () => {
      const recoveredAddress = await proxyAsWalletContract.getSigner(
        msg.from,
        msg.to,
        msg.value,
        msg.data,
        msg.nonce,
        msg.gasPrice,
        msg.gasToken,
        msg.gasLimit,
        signature);
      expect(recoveredAddress).to.eq(publicKey);
    });
  });

  describe('Transfer', async () => {
    describe('successful execution of transfer', () => {
      it('transfers funds', async () => {
        expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(0);
        await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
        expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('1.0'));
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      it('emits ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msg);
        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund in token after execute transfer ethers', async () => {
          msg = {...transferMessage, from: walletContractProxy.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

          await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });

        it('should refund after execute transfer ethers', async () => {
          const transaction = await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });
      });
    });

    describe('failed execution of transfer', () => {
      it('nonce too low', async () => {
        await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('nonce too high', async () => {
        msg = {...transferMessage, from: walletContractProxy.address, nonce: 2};
        signature = calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('emits ExecutedSigned event', async () => {
        msg = {...failedTransferMessage, from: walletContractProxy.address};
        signature = calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
        const messageHash = calculateMessageHash(msg);

        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('should increase nonce, even if transfer fails', async () => {
        msg = {...failedTransferMessage, from: walletContractProxy.address};
        signature = calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

        await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
        expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('0.0'));
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      describe('Invalid signature', () => {
        it('no signature', async () => {
          data = executeSignedFunc.encode([...getExecutionArgs(msg), []]);
          await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
            .to.be.revertedWith('Invalid signatures');
          expect(await proxyAsWalletContract.lastNonce()).to.eq(0);
          expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('0.0'));
        });

        it('invalid signature', async () => {
          data = executeSignedFunc.encode([...getExecutionArgs(msg), invalidSignature]);
          await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
            .to.be.revertedWith('Invalid signature or nonce');
          expect(await proxyAsWalletContract.lastNonce()).to.eq(0);
          expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('0.0'));
        });
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msg = {...failedTransferMessage, from: walletContractProxy.address};
          signature = calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

          const transaction = await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...failedTransferMessage, from: walletContractProxy.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
          await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });

  describe('Call', async () => {
    let msgToCall: UnsignedMessage;
    let signatureToCall: string;

    describe('successful execution of call', async () => {
      beforeEach(async () => {
        msgToCall = {...callMessage, from: walletContractProxy.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(privateKey, msgToCall);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msgToCall = {...callMessage, from: walletContractProxy.address, to: mockContract.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);

          const transaction = await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msgToCall = {...callMessage, from: walletContractProxy.address, to: mockContract.address, gasToken: mockToken.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);
          await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });

    describe('failed execution of call', () => {
      beforeEach(async () => {
        msgToCall = {...failedCallMessage, from: walletContractProxy.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(privateKey, msgToCall);
      });

      it('should increase nonce', async () => {
        await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('invalid nonce', async () => {
        msg = {...msgToCall, nonce: 2};
        signature = calculateMessageSignature(privateKey, msg);

        await expect(proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          const transaction = await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...msgToCall, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          await proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });

  describe('isValidSignature', () => {
    const MAGICVALUE = '0x20c13b0b';
    const INVALIDSIGNATURE = '0xffffffff';

    it('returns magic value if signer has the permission', async () => {
      const {proxyWallet, keyPair} = await loadFixture(walletContractFixture);
      const message = 'Hi, I am Justyna';
      const messageHex = utils.hexlify(utils.toUtf8Bytes(message));
      const signature = signString(message, keyPair.privateKey);
      expect(await proxyWallet.isValidSignature(messageHex, signature)).to.eq(MAGICVALUE);
    });

    it('returns false if signer hasn`t any permission', async () => {
      const invalidkeyPair = createKeyPair();
      const {proxyWallet} = await loadFixture(walletContractFixture);
      const message = 'Hi, I am Justyna';
      const messageHex = utils.hexlify(utils.toUtf8Bytes(message));
      const signature = signString(message, invalidkeyPair.privateKey);
      expect(await proxyWallet.isValidSignature(messageHex, signature)).to.eq(INVALIDSIGNATURE);
    });
  });

  describe('change required signatures per transaction', async () => {
    it('change number of required signatures to 2', async () => {
      await executeAddKey(proxyAsWalletContract, createKeyPair().publicKey, privateKey);
      expect(await proxyAsWalletContract.requiredSignatures()).to.eq(1);
      await executeSetRequiredSignatures(proxyAsWalletContract, 2, privateKey);
      expect(await proxyAsWalletContract.requiredSignatures()).to.eq(2);
    });

    it('don`t change the number of required signatures if the new amount is higher than keyCount', async () => {
      await executeSetRequiredSignatures(proxyAsWalletContract, (await proxyAsWalletContract.keyCount()).add(1), privateKey);
      expect(await proxyAsWalletContract.requiredSignatures()).to.eq(1);
    });
  });
});
