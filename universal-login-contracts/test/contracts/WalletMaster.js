import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, getWallets, loadFixture, deployContract} from 'ethereum-waffle';
import {constants, utils} from 'ethers';
import WalletMaster from '../../build/WalletMaster';
import {transferMessage, failedTransferMessage, callMessage, failedCallMessage} from '../fixtures/basicWallet';
import walletMasterAndProxy from '../fixtures/walletMasterAndProxy';
import {calculateMessageHash, calculateMessageSignature} from '../../lib/calculateMessageSignature';
import {DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../lib/defaultPaymentOptions';
import {getExecutionArgs} from '../utils';

chai.use(chaiAsPromised);
chai.use(solidity);

const {parseEther} = utils;
const to1 = '0x0000000000000000000000000000000000000001';
const to2 = '0x0000000000000000000000000000000000000002';

describe('WalletMaster', async () => {
  let provider;
  let identityMaster;
  let identityProxy;
  let proxyAsIdentity;
  let privateKey;
  let keyAsAddress;
  let publicKey;
  let mockToken;
  let mockContract;
  let wallet;
  let changeMasterCopyFunc;
  let executeSignedFunc;
  let msg;
  let signature;
  let data;
  let anotherWallet;
  let invalidSignature;
  let relayerBalance;
  let relayerTokenBalance;

  beforeEach(async () => {
    ({provider, identityMaster, identityProxy, proxyAsIdentity, privateKey, keyAsAddress, publicKey, mockToken, mockContract, wallet} = await loadFixture(walletMasterAndProxy));
    changeMasterCopyFunc = new utils.Interface(WalletMaster.interface).functions.updateMaster;
    executeSignedFunc = new utils.Interface(WalletMaster.interface).functions.executeSigned;
    msg = {...transferMessage, from: identityProxy.address};
    signature = await calculateMessageSignature(privateKey, msg);
    data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
    [anotherWallet] = await getWallets(provider);
    invalidSignature = await calculateMessageSignature(anotherWallet.privateKey, msg);
    relayerBalance = await wallet.getBalance();
    relayerTokenBalance = await mockToken.balanceOf(wallet.address);
  });

  it('properly construct', async () => {
    expect(await proxyAsIdentity.lastNonce()).to.eq(0);
  });

  describe('Signing', () => {
    it('initial key exist', async () => {
      expect(await proxyAsIdentity.keyExist(publicKey)).to.be.true;
    });

    it('zero key does not exist', async () => {
      expect(await proxyAsIdentity.keyExist(constants.AddressZero)).to.be.false;
    });

    it('calculates hash', async () => {
      const jsHash = calculateMessageHash(msg);
      const solidityHash = await proxyAsIdentity.calculateMessageHash(
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
      const recoveredAddress = await proxyAsIdentity.getSigner(
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
        expect(await provider.getBalance(to1)).to.eq(0);
        await wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
        expect(await provider.getBalance(to1)).to.eq(parseEther('1.0'));
        expect(await proxyAsIdentity.lastNonce()).to.eq(1);
      });

      it('emits ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msg);
        await expect(wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.emit(identityMaster, 'ExecutedSigned') // TODO: is this OK? Don't think so
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund in token after execute transfer ethers', async () => {
          msg = {...transferMessage, from: identityProxy.address, gasToken: mockToken.address};
          signature = await calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

          await wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });

        it('should refund after execute transfer ethers', async () => {
          const transaction = await wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });
      });
    });

    describe('failed execution of transfer', () => {
      it('nonce too low', async () => {
        await wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
        await expect(wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.be.revertedWith('Invalid nonce');
      });

      it('nonce too high', async () => {
        msg = {...transferMessage, from: identityProxy.address, nonce: 2};
        signature = await calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

        await expect(wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.be.revertedWith('Invalid nonce');
      });

      it('emits ExecutedSigned event', async () => {
        msg = {...failedTransferMessage, from: identityProxy.address};
        signature = await calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
        const messageHash = calculateMessageHash(msg);

        await expect(wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
          .to.emit(identityMaster, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('should increase nonce, even if transfer fails', async () => {
        msg = {...failedTransferMessage, from: identityProxy.address};
        signature = await calculateMessageSignature(privateKey, msg);
        data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

        await wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
        expect(await provider.getBalance(to1)).to.eq(parseEther('0.0'));
        expect(await proxyAsIdentity.lastNonce()).to.eq(1);
      });

      describe('Invalid signature', () => {
        it('no signature', async () => {
          data = executeSignedFunc.encode([...getExecutionArgs(msg), []]);
          await expect(wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
            .to.be.revertedWith('Invalid signature');
          expect(await proxyAsIdentity.lastNonce()).to.eq(0);
          expect(await provider.getBalance(to1)).to.eq(parseEther('0.0'));
        });

        it('invalid signature', async () => {
          data = executeSignedFunc.encode([...getExecutionArgs(msg), invalidSignature]);
          await expect(wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT}))
            .to.be.revertedWith('Invalid signature');
          expect(await proxyAsIdentity.lastNonce()).to.eq(0);
          expect(await provider.getBalance(to1)).to.eq(parseEther('0.0'));
        });
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msg = {...failedTransferMessage, from: identityProxy.address};
          signature = await calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);

          const transaction = await wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...failedTransferMessage, from: identityProxy.address, gasToken: mockToken.address};
          signature = await calculateMessageSignature(privateKey, msg);
          data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
          await wallet.sendTransaction({to: identityProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
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
        msgToCall = {...callMessage, from: identityProxy.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(privateKey, msgToCall);
      });

      it('called method', async () => {
        expect(await mockContract.wasCalled()).to.be.false;
        await proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('increase nonce', async () => {
        await proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await proxyAsIdentity.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(proxyAsIdentity, 'ExecutedSigned')
          .withArgs(messageHash, 0, true);
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          msgToCall = {...callMessage, from: identityProxy.address, to: mockContract.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);

          const transaction = await proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msgToCall = {...callMessage, from: identityProxy.address, to: mockContract.address, gasToken: mockToken.address};
          signatureToCall = calculateMessageSignature(privateKey, msgToCall);
          await proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });

    describe('failed execution of call', () => {
      beforeEach(async () => {
        msgToCall = {...failedCallMessage, from: identityProxy.address, to: mockContract.address};
        signatureToCall = calculateMessageSignature(privateKey, msgToCall);
      });

      it('should increase nonce', async () => {
        await proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
        expect(await proxyAsIdentity.lastNonce()).to.eq(1);
      });

      it('should emit ExecutedSigned event', async () => {
        const messageHash = calculateMessageHash(msgToCall);
        await expect(proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.emit(identityMaster, 'ExecutedSigned')
          .withArgs(messageHash, 0, false);
      });

      it('invalid nonce', async () => {
        msg = {...msgToCall, nonce: 2};
        signature = calculateMessageSignature(privateKey, msg);

        await expect(proxyAsIdentity.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
          .to.be.revertedWith('Invalid nonce');
      });

      describe('refund', () => {
        it('should refund ether', async () => {
          const transaction = await proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);

          const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
          const totalCost = gasUsed.mul(utils.bigNumberify(DEFAULT_GAS_PRICE));

          expect(await wallet.getBalance()).to.be.above(relayerBalance.sub(totalCost));
        });

        it('should refund tokens', async () => {
          msg = {...msgToCall, gasToken: mockToken.address};
          signature = calculateMessageSignature(privateKey, msg);
          await proxyAsIdentity.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
          expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance);
        });
      });
    });
  });

  describe('MasterCopy', () => {
    let msgToCall;
    let signatureToCall;

    it('should fail if changing masterCopy through proxy with zero address', async () => {
      expect(await proxyAsIdentity.master()).to.eq(identityMaster.address);
      const data = changeMasterCopyFunc.encode([constants.AddressZero, [], false]);
      msgToCall = {...callMessage, data, from: proxyAsIdentity.address, to: proxyAsIdentity.address };
      signatureToCall = await calculateMessageSignature(privateKey, msgToCall);
      const messageHash = calculateMessageHash(msgToCall);
      await expect(proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
        .to.emit(proxyAsIdentity, 'ExecutedSigned')
        .withArgs(messageHash, 0, false);
      expect(await proxyAsIdentity.master()).to.eq(identityMaster.address);
    });

    it('should fail if changing masterCopy through proxy with invalid master', async () => {
      expect(await proxyAsIdentity.master()).to.eq(identityMaster.address);
      const data = changeMasterCopyFunc.encode([to2, [], false]);
      msgToCall = {...callMessage, data, from: proxyAsIdentity.address, to: proxyAsIdentity.address };
      signatureToCall = await calculateMessageSignature(privateKey, msgToCall);
      const messageHash = calculateMessageHash(msgToCall);
      await expect(proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
        .to.emit(proxyAsIdentity, 'ExecutedSigned')
        .withArgs(messageHash, 0, false);
      expect(await proxyAsIdentity.master()).to.eq(identityMaster.address);
    });

    it('should change masterCopy through proxy with valid address', async () => {
      const otherIdentityMaster = await deployContract(wallet, WalletMaster);
      expect(await proxyAsIdentity.master()).to.eq(identityMaster.address);
      const data = changeMasterCopyFunc.encode([otherIdentityMaster.address, [], false]);
      msgToCall = {...callMessage, data, from: proxyAsIdentity.address, to: proxyAsIdentity.address };
      signatureToCall = await calculateMessageSignature(privateKey, msgToCall);
      const messageHash = calculateMessageHash(msgToCall);
      await expect(proxyAsIdentity.executeSigned(...getExecutionArgs(msgToCall), signatureToCall, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
        .to.emit(proxyAsIdentity, 'ExecutedSigned')
        .withArgs(messageHash, 0, true);
      expect(await proxyAsIdentity.master()).to.eq(otherIdentityMaster.address);
    });
  });
});
