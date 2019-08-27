import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, getWallets, loadFixture} from 'ethereum-waffle';
import {constants, utils} from 'ethers';
import WalletMaster from '../../build/WalletMasterWithRefund.json';
import {transferMessage, failedTransferMessage, callMessage, failedCallMessage} from '../utils/ExampleMessages';
import walletMasterAndProxy from '../fixtures/walletMasterAndProxy';
import {calculateMessageHash, calculateMessageSignature, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../lib/defaultPaymentOptions';
import {getExecutionArgs} from '../utils';

chai.use(chaiAsPromised);
chai.use(solidity);

const {parseEther} = utils;

describe('WalletMaster', async () => {
  let provider;
  let walletContractProxy;
  let proxyAsWalletContract;
  let privateKey;
  let mockToken;
  let mockContract;
  let wallet;
  let executeSignedFunc;
  let msg;
  let signature;
  let data;
  let anotherWallet;
  let invalidSignature;
  let relayerBalance;
  let relayerTokenBalance;
  let publicKey;

  beforeEach(async () => {
    ({provider, publicKey, walletContractProxy, proxyAsWalletContract, privateKey, mockToken, mockContract, wallet} = await loadFixture(walletMasterAndProxy));
    executeSignedFunc = new utils.Interface(WalletMaster.interface).functions.executeSigned;
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
          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });
      });
    });

    describe('failed execution of transfer', () => {
      it('nonce too low', async () => {
        await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.be.revertedWith('Invalid nonce');
      });

      it('nonce too high', async () => {
        msg = {...transferMessage, from: walletContractProxy.address, nonce: 2};
        signature = calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.be.revertedWith('Invalid nonce');
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
            .to.be.revertedWith('Invalid signature');
          expect(await proxyAsWalletContract.lastNonce()).to.eq(0);
          expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('0.0'));
        });

        it('invalid signature', async () => {
          data = executeSignedFunc.encode([...getExecutionArgs(msg), invalidSignature]);
          await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
            .to.be.revertedWith('Invalid signature');
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

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

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
    let msgToCall;
    let signatureToCall;

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
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

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
          .to.be.revertedWith('Invalid nonce');
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          const transaction = await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

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

});
