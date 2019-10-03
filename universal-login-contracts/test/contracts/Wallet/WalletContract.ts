import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, getWallets, loadFixture, deployContract} from 'ethereum-waffle';
import {constants, utils, providers, Wallet, Contract} from 'ethers';
import WalletContract from '../../../build/Wallet.json';
import {transferMessage, failedTransferMessage, callMessage, failedCallMessage, executeSetRequiredSignatures, executeAddKey} from '../../helpers/ExampleMessages';
import walletAndProxy from '../../fixtures/walletAndProxy';
import {calculateMessageHash, calculateMessageSignature, DEFAULT_GAS_PRICE, TEST_ACCOUNT_ADDRESS, UnsignedMessage, signString, createKeyPair, SignedMessage, ONE_SIGNATURE_GAS_COST, sortPrivateKeysByAddress, concatenateSignatures, TEST_GAS_PRICE, Message} from '@universal-login/commons';
import {getExecutionArgs, setupUpdateMessage, estimateGasDataForNoSignature} from '../../helpers/argumentsEncoding';
import {walletContractFixture} from '../../fixtures/walletContract';
import UpgradedWallet from '../../../build/UpgradedWallet.json';
import {encodeDataForExecuteSigned, estimateGasDataFromSignedMessage, messageToSignedMessage, emptyMessage, messageToUnsignedMessage} from '../../../lib/index.js';
import {calculateFinalGasLimit, calculatePaymentOptions} from '../../../lib/estimateGas';

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
  let walletContractMaster: Contract;

  beforeEach(async () => {
    ({provider, publicKey, walletContractProxy, proxyAsWalletContract, privateKey, mockToken, mockContract, walletContractMaster, wallet} = await loadFixture(walletAndProxy));
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
  });
  describe('Transfer', async () => {
    describe('successful execution of transfer', () => {
      it('transfers funds', async () => {
        expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(0);
        const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
        await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit});
        expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('1.0'));
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      it('emits ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msg);
        const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit}))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund in token after execute transfer ethers', async () => {
          msg = {...transferMessage, from: walletContractProxy.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

          const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
          await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit});
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });

        it('should refund after execute transfer ethers', async () => {
          const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
          const transaction = await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit});
          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });
      });
    });

    describe('failed execution of transfer', () => {
      it('nonce too low', async () => {
        const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
        await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit});
        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit}))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('nonce too high', async () => {
        msg = {...transferMessage, from: walletContractProxy.address, nonce: 2};
        signature = calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

        const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit}))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('emits ExecutedSigned event', async () => {
        msg = {...failedTransferMessage, from: walletContractProxy.address};
        signature = calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
        const messageHash = calculateMessageHash(msg);

        const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
        await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit}))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('should increase nonce, even if transfer fails', async () => {
        msg = {...failedTransferMessage, from: walletContractProxy.address};
        signature = calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

        const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
        await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit});
        expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('0.0'));
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      describe('Invalid signature', () => {
        it('no signature', async () => {
          data = executeSignedFunc.encode([...getExecutionArgs(msg), []]);
          const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, estimateGasDataForNoSignature(msg));
          await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit}))
            .to.be.revertedWith('Invalid signatures');
          expect(await proxyAsWalletContract.lastNonce()).to.eq(0);
          expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(parseEther('0.0'));
        });

        it('invalid signature', async () => {
          data = executeSignedFunc.encode([...getExecutionArgs(msg), invalidSignature]);
          const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
          await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit}))
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

          const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
          const transaction = await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit});

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...failedTransferMessage, from: walletContractProxy.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
          const gasLimit = calculateFinalGasLimit(msg.gasLimitExecution, msg.gasData);
          await wallet.sendTransaction({to: walletContractProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit});
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
        await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall)))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msgToCall = {...callMessage, from: walletContractProxy.address, to: mockContract.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);

          const transaction = await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msgToCall = {...callMessage, from: walletContractProxy.address, to: mockContract.address, gasToken: mockToken.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);
          await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
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
        await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
        expect(await proxyAsWalletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall)))
          .to.emit(proxyAsWalletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('invalid nonce', async () => {
        msg = {...msgToCall, nonce: 2};
        signature = calculateMessageSignature(privateKey, msg);

        await expect(proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          const transaction = await proxyAsWalletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...msgToCall, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          await proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });

  describe('remove key', async () => {
    let removeKeyMessage: Message;
    before(() => {
      removeKeyMessage = {
        ...emptyMessage,
        from: proxyAsWalletContract.address,
        to: proxyAsWalletContract.address,
        data: proxyAsWalletContract.interface.functions.removeKey.encode([publicKey]),
        gasPrice: TEST_GAS_PRICE,
        gasLimit: '150000',
      };
    });

    it('cannot remove the last key', async () => {
      const nonce = await proxyAsWalletContract.lastNonce();
      const removeKeyUnsignedMessage = messageToUnsignedMessage({...removeKeyMessage, nonce});
      removeKeyUnsignedMessage.gasData = utils.bigNumberify(removeKeyUnsignedMessage.gasData).add(ONE_SIGNATURE_GAS_COST);
      const signature = calculateMessageSignature(privateKey, removeKeyUnsignedMessage);
      await proxyAsWalletContract.executeSigned(...getExecutionArgs(removeKeyUnsignedMessage), signature, calculatePaymentOptions(removeKeyUnsignedMessage));
      expect(await proxyAsWalletContract.keyExist(publicKey)).to.be.true;
    });

    it('cannot remove more key than is required to sign', async () => {
      const secondKeyPair = createKeyPair();
      const sortedKeys = sortPrivateKeysByAddress([secondKeyPair.privateKey, privateKey]);
      await executeAddKey(proxyAsWalletContract, secondKeyPair.publicKey, privateKey);
      await executeSetRequiredSignatures(proxyAsWalletContract, 2, privateKey);
      const nonce = await proxyAsWalletContract.lastNonce();
      const removeKeyUnsignedMessage = messageToUnsignedMessage({...removeKeyMessage, nonce});
      removeKeyUnsignedMessage.gasData = utils.bigNumberify(removeKeyUnsignedMessage.gasData).add(ONE_SIGNATURE_GAS_COST);
      const signature1 = calculateMessageSignature(sortedKeys[0], removeKeyUnsignedMessage);
      const signature2 = calculateMessageSignature(sortedKeys[1], removeKeyUnsignedMessage);
      const signatures = concatenateSignatures([signature1, signature2]);
      await proxyAsWalletContract.executeSigned(...getExecutionArgs(removeKeyUnsignedMessage), signatures, calculatePaymentOptions(removeKeyUnsignedMessage));
      expect(await proxyAsWalletContract.keyExist(secondKeyPair.publicKey)).to.be.true;
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

  describe('Upgrade', () => {
    let newWallet: Contract;
    let updateData: string;
    let signedUpdateMessage: SignedMessage;
    let gasLimit: any;

    beforeEach(async () => {
      newWallet = await deployContract(wallet, UpgradedWallet);
      signedUpdateMessage = messageToSignedMessage(await setupUpdateMessage(proxyAsWalletContract, newWallet.address), privateKey);
      updateData = encodeDataForExecuteSigned(signedUpdateMessage);
      gasLimit = calculateFinalGasLimit(signedUpdateMessage.gasLimitExecution, signedUpdateMessage.gasData);
    });

    it('before upgrade', async () => {
      expect(await walletContractProxy.implementation()).to.eq(walletContractMaster.address);
    });

    it('updates master', async () => {
      await wallet.sendTransaction({to: proxyAsWalletContract.address, data: updateData, gasLimit});
      expect(await walletContractProxy.implementation()).to.eq(newWallet.address);
      const proxyAsUpdatedWallet = new Contract(proxyAsWalletContract.address, UpgradedWallet.abi, wallet);
      expect(await proxyAsUpdatedWallet.getFive()).to.eq(5);
      expect(await proxyAsUpdatedWallet.lastNonce()).to.eq(1);
    });

    it('updates store', async () => {
      await wallet.sendTransaction({to: proxyAsWalletContract.address, data: updateData, gasLimit});
      const proxyAsUpdatedWallet = new Contract(proxyAsWalletContract.address, UpgradedWallet.abi, wallet);
      expect(await proxyAsUpdatedWallet.someNumber()).to.eq(0);
      await proxyAsUpdatedWallet.change(10);
      expect(await proxyAsUpdatedWallet.someNumber()).to.eq(10);
    });

    it('updates master fails when sender has no permission', async () => {
      await expect(walletContractProxy.upgradeTo(newWallet.address)).to.be.revertedWith('Unauthorized');
    });
  });

  describe('gasLimitExecution', () => {
    it('reject execution that has too small gasLimit', async () => {
      const tooLowGasLimit = utils.bigNumberify(msg.gasLimitExecution).sub(1);
      await expect(wallet.sendTransaction({to: walletContractProxy.address, data, gasLimit: tooLowGasLimit})).to.be.eventually.rejectedWith('Relayer set gas limit too low');
      expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(0);
    });

    it('execute message that has enough gas limit', async () => {
      const gasData = estimateGasDataFromSignedMessage({...msg, signature});
      const validGasLimit = calculateFinalGasLimit(msg.gasLimitExecution, gasData);
      await wallet.sendTransaction({to: walletContractProxy.address, data, gasLimit: validGasLimit});
      expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther('1'));
    });
  });
});
