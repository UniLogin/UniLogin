import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {getWallets, loadFixture, solidity} from 'ethereum-waffle';
import basicExecutor from '../../fixtures/basicExecutor';
import {transferMessage, failedTransferMessage, callMessage, failedCallMessage} from '../../helpers/ExampleMessages';
import {utils, providers, Contract, Wallet} from 'ethers';
import {calculateMessageHash, calculateMessageSignature, concatenateSignatures, DEFAULT_GAS_PRICE, TEST_ACCOUNT_ADDRESS, UnsignedMessage, KeyPair, SignedMessage, ONE_SIGNATURE_GAS_COST} from '@universal-login/commons';
import {getExecutionArgs, estimateGasDataForNoSignature} from '../../helpers/argumentsEncoding';
import {calculatePaymentOptions, estimateGasDataFromSignedMessage} from '../../../lib/estimateGas';

chai.use(chaiAsPromised);
chai.use(solidity);

const {parseEther} = utils;
const to = TEST_ACCOUNT_ADDRESS;


describe('CONTRACT: Executor - main', async  () => {
  let provider: providers.Provider;
  let walletContract: Contract;
  let signature: string;
  let msg: UnsignedMessage;
  let mockContract: Contract;
  let wallet: Wallet;
  let mockToken: Contract;
  let anotherWallet: Wallet;
  let invalidSignature: string;
  let relayerBalance: utils.BigNumber;
  let relayerTokenBalance: utils.BigNumber;
  let sortedKeys: string[];
  let managementKeyPair: KeyPair;
  let msgToCall: UnsignedMessage;
  let signatureToCall: string;
  let signatures: string;

  beforeEach(async () => {
    ({provider, walletContract, managementKeyPair, sortedKeys, mockToken, mockContract, wallet} = await loadFixture(basicExecutor));
    msg = {...transferMessage, from: walletContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
    [anotherWallet] = await getWallets(provider);
    invalidSignature = calculateMessageSignature(anotherWallet.privateKey, msg);
    relayerBalance = await wallet.getBalance();
    relayerTokenBalance = await mockToken.balanceOf(wallet.address);
  });

  describe('construction', () => {
    it('properly construct', async () => {
      expect(await walletContract.lastNonce()).to.eq(0);
      expect(await walletContract.requiredSignatures()).to.eq(1);
    });

    it('first key exist', async () => {
      expect(await walletContract.keyExist(managementKeyPair.publicKey)).to.be.true;
    });

    it('empty key does exist', async () => {
      expect(await walletContract.keyExist('0x0000000000000000000000000000000000000000')).to.be.false;
    });
  });



  describe('Transfer', async () => {
    describe('successful execution of transfer', () => {
      it('transfers funds', async () => {
        expect(await provider.getBalance(to)).to.eq(0);
        await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
        expect(await provider.getBalance(to)).to.eq(parseEther('1.0'));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('emits ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msg);
        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg)))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund in token after execute transfer ethers', async () => {
          msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(managementKeyPair.privateKey, msg);

          await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));

          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });

        it('should refund after execute transfer ethers', async () => {
          const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });
      });
    });

    describe('failed execution of transfer', () => {
      it('nonce too low', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('nonce too high', async () => {
        msg = {...transferMessage, from: walletContract.address, nonce: 2};
        signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('emits ExecutedSigned event', async () => {
        msg = {...failedTransferMessage, from: walletContract.address};
        signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
        const messageHash = calculateMessageHash(msg);

        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg)))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('should increase nonce, even if transfer fails', async () => {
        msg = {...failedTransferMessage, from: walletContract.address};
        signature = calculateMessageSignature(managementKeyPair.privateKey, msg);

        await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
        expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      describe('Invalid signature', () => {
        it('no signature', async () => {
          msg = {...msg, gasData: estimateGasDataForNoSignature(msg)};
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), [], calculatePaymentOptions(msg)))
            .to.be.revertedWith('Invalid signatures');
          expect(await walletContract.lastNonce()).to.eq(0);
          expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
        });

        it('should be reverted', async () => {
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), invalidSignature, calculatePaymentOptions(msg)))
            .to.be.revertedWith('Invalid signature or nonce');
        });

        it('shouldn`t transfer ethers', async () => {
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), invalidSignature, calculatePaymentOptions(msg)))
            .to.be.revertedWith('Invalid signature or nonce');
          expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
        });

        it('shouldn`t increase nonce', async () => {
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), invalidSignature, calculatePaymentOptions(msg)))
            .to.be.revertedWith('Invalid signature or nonce');
          expect(await walletContract.lastNonce()).to.eq(0);
        });
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msg = {...failedTransferMessage, from: walletContract.address};
          signature = calculateMessageSignature(managementKeyPair.privateKey, msg);

          const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...failedTransferMessage, from: walletContract.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
          await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });

  describe('Multi-Signature call with 2 signatures', async () => {
    describe('Successful execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        msgToCall.gasData = utils.bigNumberify(msgToCall.gasData).add(ONE_SIGNATURE_GAS_COST);
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        signatures = concatenateSignatures([signature1, signature2]);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall));
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall)))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      it('with 2 required Signature', async () => {
        await walletContract.setRequiredSignatures(2);
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall));
        expect(await mockContract.wasCalled()).to.be.true;
      });
    });

    describe('failed execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
      });

      it('should fail with a least an invalid signature', async () => {
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, invalidSignature]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('should fail if there are two equal singatures', async () => {
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, signature1]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('should fail with invalid signature size', async () => {
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        const corruptedSignatures = `${concatenateSignatures([signature1, signature2])}a`;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('should fail 0 length input in signatures', async () => {
        msgToCall = {...msgToCall, gasData: estimateGasDataForNoSignature(msgToCall)};
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), '0x', calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signatures');
      });

      it('called method with not enough signatures', async () => {
        signatures = calculateMessageSignature(sortedKeys[0], msgToCall);
        await walletContract.setRequiredSignatures(3);
        expect(await mockContract.wasCalled()).to.be.false;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Not enough signatures');
        expect(await mockContract.wasCalled()).to.be.false;
      });

      it('called method with duplicated signatures', async () => {
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        signatures = await concatenateSignatures([signature1, signature2, signature2]);
        msgToCall = {...msgToCall, gasData: estimateGasDataFromSignedMessage({...msgToCall, signature: signatures} as SignedMessage)};
        await walletContract.setRequiredSignatures(3);
        expect(await mockContract.wasCalled()).to.be.false;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
        expect(await mockContract.wasCalled()).to.be.false;
      });
    });
  });

  describe('Multi-Signature call with 3 signatures', async () => {
    describe('Successful execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        msgToCall.gasData = utils.bigNumberify(msgToCall.gasData).add(ONE_SIGNATURE_GAS_COST.mul(2));
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        const signature3 = calculateMessageSignature(sortedKeys[2], msgToCall);
        signatures = concatenateSignatures([signature1, signature2, signature3]);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall));
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('call method with 3 out of 2 required signatures', async () => {
        await walletContract.setRequiredSignatures(2);
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall));
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('call method with 3 out of 3 required signatures', async () => {
        await walletContract.setRequiredSignatures(3);
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall));
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall)))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      it('should fail with not sorted signatures', async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        msgToCall.gasData = utils.bigNumberify(msgToCall.gasData).add(ONE_SIGNATURE_GAS_COST.mul(2));
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        const signature3 = calculateMessageSignature(sortedKeys[2], msgToCall);
        signatures = concatenateSignatures([signature2, signature1, signature3]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });
    });

    describe('failed execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        msgToCall.gasData = utils.bigNumberify(msgToCall.gasData).add(ONE_SIGNATURE_GAS_COST);
      });

      it('should fail with a least an invalid signature', async () => {
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, signature2, invalidSignature]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('should fail if there are two equal singatures', async () => {
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, signature1, signature2]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('should fail with invalid signature size', async () => {
        msgToCall.gasData = utils.bigNumberify(msgToCall.gasData).sub('4420');
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        const corruptedSignatures = `${concatenateSignatures([signature1, signature2])}a`;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      it('should fail 0 length input in signatures', async () => {
        msgToCall.gasData = estimateGasDataForNoSignature(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), '0x', calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signatures');
      });

      it('should fail with not sorted signatures', async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        msgToCall.gasData = utils.bigNumberify(msgToCall.gasData).add(ONE_SIGNATURE_GAS_COST.mul(2));
        const signature1 = calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = calculateMessageSignature(sortedKeys[1], msgToCall);
        const signature3 = calculateMessageSignature(sortedKeys[2], msgToCall);
        signatures = concatenateSignatures([signature1, signature3, signature2]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, calculatePaymentOptions(msgToCall)))
          .to.be.revertedWith('Invalid signature or nonce');
      });
    });
  });

  describe('Call', async () => {
    describe('successful execution of call', () => {
      before(() => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(managementKeyPair.privateKey, msgToCall);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall)))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
          signatureToCall = calculateMessageSignature(managementKeyPair.privateKey, msgToCall);

          const transaction = await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address, gasToken: mockToken.address};
          signatureToCall = calculateMessageSignature(managementKeyPair.privateKey, msgToCall);
          await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });

    describe('failed execution of call', () => {
      before(() => {
        msgToCall = {...failedCallMessage, from: walletContract.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(managementKeyPair.privateKey, msgToCall);
      });

      it('should increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall)))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('Invalid nonce', async () => {
        msg = {...msgToCall, nonce: 2};
        signature = calculateMessageSignature(managementKeyPair.privateKey, msg);

        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg)))
          .to.be.revertedWith('Invalid signature or nonce');
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          const transaction = await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, calculatePaymentOptions(msgToCall));

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed!.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...msgToCall, gasToken: mockToken.address};
          signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
          await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });
});
