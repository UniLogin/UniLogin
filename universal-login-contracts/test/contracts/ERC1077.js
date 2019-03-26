import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {getWallets, loadFixture, solidity} from 'ethereum-waffle';
import basicWallet, {transferMessage, failedTransferMessage, callMessage, failedCallMessage} from '../fixtures/basicWallet';
import {utils} from 'ethers';
import {calculateMessageHash, calculateMessageSignature, concatenateSignatures} from '../../lib/calculateMessageSignature';
import {DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN, DEFAULT_GAS_PRICE} from '../../lib/defaultPaymentOptions';
import {getExecutionArgs} from '../utils';

chai.use(chaiAsPromised);
chai.use(solidity);

const {parseEther} = utils;
const to = '0x0000000000000000000000000000000000000001';

describe('ERC1077 - main', async  () => {
  let provider;
  let walletContract;
  let privateKey;
  let keyAsAddress;
  let publicKey;
  let signature;
  let msg;
  let mockContract;
  let wallet;
  let mockToken;
  let anotherWallet;
  let invalidSignature;
  let relayerBalance;
  let relayerTokenBalance;
  let sortedKeys;

  beforeEach(async () => {
    ({provider, identity: walletContract, privateKey, sortedKeys, keyAsAddress, publicKey, mockToken, mockContract, wallet} = await loadFixture(basicWallet));
    msg = {...transferMessage, from: walletContract.address};
    signature = await calculateMessageSignature(privateKey, msg);
    [anotherWallet] = await getWallets(provider);
    invalidSignature = await calculateMessageSignature(anotherWallet.privateKey, msg);
    relayerBalance = await wallet.getBalance();
    relayerTokenBalance = await mockToken.balanceOf(wallet.address);
  });

  describe('construction', () => {
    it('properly construct', async () => {
      expect(await walletContract.lastNonce()).to.eq(0);
      expect(await walletContract.requiredSignatures()).to.eq(1);
    });

    it('first key exist', async () => {
      expect(await walletContract.keyExist(publicKey)).to.be.true;
    });

    it('empty key does exist', async () => {
      expect(await walletContract.keyExist('0x0000000000000000000000000000000000000000')).to.be.false;
    });
  });

  describe('change required signatures per transaction', async () => {
    it('should change the number of required signatures successfully', async () => {
        await walletContract.setRequiredSignatures(2);
        expect(await walletContract.requiredSignatures()).to.eq(2);
    });

    it('should change the number of required signatures to keyCount', async () => {
        await walletContract.setRequiredSignatures(await walletContract.keyCount());
        expect(await walletContract.requiredSignatures()).to.eq(await walletContract.keyCount());
    });

    it('should fail to change the amount of required signatures if the amount is equal to the actual amount', async () => {
        await expect(walletContract.setRequiredSignatures(1)).to.be.revertedWith('Invalid required signature');
    });

    it('should fail to change the amount of required signatures if the new amount 0', async () => {
        await expect(walletContract.setRequiredSignatures(0)).to.be.revertedWith('Invalid required signature');
    });

    it('should fail to change the amount of required signatures if the new amount is higher than keyCount', async () => {
        await expect(walletContract.setRequiredSignatures(await walletContract.keyCount() + 1)).to.be.revertedWith('Signatures exceed owned keys number');
    });
  });
  describe('signing message', () => {
    it('calculates hash', async () => {
      const jsHash = calculateMessageHash(msg);
      const solidityHash = await walletContract.calculateMessageHash(
        msg.from,
        msg.to,
        msg.value,
        msg.data,
        msg.nonce,
        msg.gasPrice,
        msg.gasToken,
        msg.gasLimit, 0);
      expect(jsHash).to.eq(solidityHash);
    });

    it('recovers signature', async () => {
      const recoveredAddress = await walletContract.getSigner(
        msg.from,
        msg.to,
        msg.value,
        msg.data,
        msg.nonce,
        msg.gasPrice,
        msg.gasToken,
        msg.gasLimit,
        0,
        signature);
      expect(recoveredAddress).to.eq(keyAsAddress);
    });
  });

  describe('Transfer', async () => {
    describe('successful execution of transfer', () => {
      it('transfers funds', async () => {
        expect(await provider.getBalance(to)).to.eq(0);
        await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await provider.getBalance(to)).to.eq(parseEther('1.0'));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('emits ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msg);
        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund in token after execute transfer ethers', async () => {
          msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);

          await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });

        it('should refund after execute transfer ethers', async () => {
          const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });
      });
    });

    describe('failed execution of transfer', () => {
      it('nonce too low', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid nonce');
      });

      it('nonce too high', async () => {
        msg = {...transferMessage, nonce: 2};
        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid nonce');
      });

      it('emits ExecutedSigned event', async () => {
        msg = {...failedTransferMessage, from: walletContract.address};
        signature = calculateMessageSignature(privateKey, msg);
        const messageHash = calculateMessageHash(msg);

        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('should increase nonce, even if transfer fails', async () => {
        msg = {...failedTransferMessage, from: walletContract.address};
        signature = calculateMessageSignature(privateKey, msg);

        await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      describe('Invalid signature', () => {
        it('no signature', async () => {
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), [], DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
            .to.be.revertedWith('Invalid signature');
          expect(await walletContract.lastNonce()).to.eq(0);
          expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
        });

        it('should be reverted', async () => {
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), invalidSignature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
            .to.be.revertedWith('Invalid signature');
        });

        it('shouldn`t transfer ethers', async () => {
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), invalidSignature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
            .to.be.revertedWith('Invalid signature');
          expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
        });

        it('shouldn`t increase nonce', async () => {
          await expect(walletContract.executeSigned(...getExecutionArgs(msg), invalidSignature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
            .to.be.revertedWith('Invalid signature');
          expect(await walletContract.lastNonce()).to.eq(0);
        });
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msg = {...failedTransferMessage, from: walletContract.address};
          signature = calculateMessageSignature(privateKey, msg);

          const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...failedTransferMessage, from: walletContract.address, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });

  describe('Multi-Signature call with 2 signatures', async () => {
    let msgToCall;
    let signatures;

    describe('Successful execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        signatures = concatenateSignatures([signature1, signature2]);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      it('with 2 required Signature', async () => {
        await walletContract.setRequiredSignatures(2);
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });
    });

    describe('failed execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
      });

      it('should fail with a least an invalid signature', async () => {
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, invalidSignature]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('should fail if there are two equal singatures', async () => {
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, signature1]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('should fail with invalid signature size', async () => {
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        const corruptedSignatures = `${concatenateSignatures([signature1, signature2])}a`;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('should fail 0 length input in signatures', async () => {
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), '0x', DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('called method with not enough signatures', async () => {
        signatures = await calculateMessageSignature(sortedKeys[0], msgToCall);
        await walletContract.setRequiredSignatures(3);
        expect(await mockContract.wasCalled()).to.be.false;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Not enough signatures');
        expect(await mockContract.wasCalled()).to.be.false;
      });

      it('called method with duplicated signatures', async () => {
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        signatures = await concatenateSignatures([signature1, signature2, signature2]);
        await walletContract.setRequiredSignatures(3);
        expect(await mockContract.wasCalled()).to.be.false;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
        expect(await mockContract.wasCalled()).to.be.false;
      });
    });
  });

  describe('Multi-Signature call with 3 signatures', async () => {
    let msgToCall;
    let signatures;

    describe('Successful execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        const signature3 = await calculateMessageSignature(sortedKeys[2], msgToCall);
        signatures = concatenateSignatures([signature1, signature2, signature3]);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('call method with 3 out of 2 required signatures', async () => {
        await walletContract.setRequiredSignatures(2);
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('call method with 3 out of 3 required signatures', async () => {
        await walletContract.setRequiredSignatures(3);
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      it('should fail with not sorted signatures', async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        const signature3 = await calculateMessageSignature(sortedKeys[2], msgToCall);
        signatures = concatenateSignatures([signature2, signature1, signature3]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });
    });

    describe('failed execution of call via multi-signature', async () => {
      before(async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
      });

      it('should fail with a least an invalid signature', async () => {
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, signature2, invalidSignature]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('should fail if there are two equal singatures', async () => {
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        const corruptedSignatures = concatenateSignatures([signature1, signature1, signature2]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('should fail with invalid signature size', async () => {
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        const signature3 = await calculateMessageSignature(sortedKeys[2], msgToCall);
        const corruptedSignatures = `${concatenateSignatures([signature1, signature2])}a`;
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), corruptedSignatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('should fail 0 length input in signatures', async () => {
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), '0x', DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });

      it('should fail with not sorted signatures', async () => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        const signature1 = await calculateMessageSignature(sortedKeys[0], msgToCall);
        const signature2 = await calculateMessageSignature(sortedKeys[1], msgToCall);
        const signature3 = await calculateMessageSignature(sortedKeys[2], msgToCall);
        signatures = concatenateSignatures([signature1, signature3, signature2]);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatures, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid signature');
      });
    });
  });

  describe('Call', async () => {
    let msgToCall;
    let signatureToCall;

    describe('successful execution of call', () => {
      before(() => {
        msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(privateKey, msgToCall);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);

          const transaction = await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msgToCall = {...callMessage, from: walletContract.address, to: mockContract.address, gasToken: mockToken.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);
          await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });

    describe('failed execution of call', () => {
      before(() => {
        msgToCall = {...failedCallMessage, from: walletContract.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(privateKey, msgToCall);
      });

      it('should increase nonce', async () => {
        await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await walletContract.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(walletContract, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('invalid nonce', async () => {
        msg = {...msgToCall, nonce: 2};
        signature = calculateMessageSignature(privateKey, msg);

        await expect(walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid nonce');
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          const transaction = await walletContract.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...msgToCall, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          await walletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });
});
