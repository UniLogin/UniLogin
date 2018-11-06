import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, getWallets} from 'ethereum-waffle';
import basicIdentity, {transferMessage} from '../fixtures/basicIdentity';
import {utils} from 'ethers';
import {OPERATION_CALL} from 'universal-login-contracts/lib/consts';
import TestHelper from '../testHelper';
import calculateMessageSignature, {calculateMessageHash} from '../../lib/calculateMessageSignature';

chai.use(chaiAsPromised);
chai.use(solidity);

const {parseEther} = utils;
const to = '0x0000000000000000000000000000000000000001';
const ETHER = '0x0000000000000000000000000000000000000000';

describe('ERC1077', async () => {
  const testHelper = new TestHelper();
  let provider;
  let identity;
  let privateKey;
  let keyAsAddress;
  let publicKey;
  let signature;
  let msg;
  let mockContract;

  beforeEach(async () => {
    ({provider, identity, privateKey, keyAsAddress, publicKey, mockContract} = await testHelper.load(basicIdentity));
    msg = {...transferMessage, from: identity.address};
    signature = calculateMessageSignature(privateKey, msg);
  });

  it('properly construct', async () => {
    expect(await identity.lastNonce()).to.eq(0);
  });

  describe('signing message', () => {
    it('key exist', async () => {
      expect(await identity.keyExist(publicKey)).to.be.true;
    });

    it('key exist', async () => {
      expect(await identity.keyExist([])).to.be.false;
    });

    it('calculates hash', async () => {
      const jsHash = calculateMessageHash(msg);
      const solidityHash = await identity.calculateMessageHash(
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
      const recoveredAddress = await identity.getSigner(
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

  describe('successful execution of transfer', () => {
    it('transfers funds', async () => {
      expect(await provider.getBalance(to)).to.eq(0);
      await identity.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, signature);
      expect(await provider.getBalance(to)).to.eq(parseEther('1.0'));
      expect(await identity.lastNonce()).to.eq(1);
    });

    it('emits ExecutedSigned event', async () => {
      const messageHash = calculateMessageHash(msg);
      await expect(identity.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, signature))
        .to.emit(identity, 'ExecutedSigned')
        .withArgs(messageHash, 0, true);
    });

    xit('refunded');
  });

  describe('fails if invalid nonce', () => {
    it('fails if nonce too low', async () => {
      await identity.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, signature);
      await expect(identity.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, signature))
        .to.be.revertedWith('Invalid nonce');
    });

    it('fails if nonce too high', async () => {
      await expect(identity.executeSigned(to, parseEther('1.0'), [], 2, 0, ETHER, 0, OPERATION_CALL, signature))
        .to.be.revertedWith('Invalid nonce');
    });
  });

  describe('successful execution of call', () => {
    let callMockData;
    let msgToCall;
    let signatureToCall;

    before(() => {
      callMockData = mockContract.interface.functions.callMe().data; 
      msgToCall = {...transferMessage, from: identity.address, to: mockContract.address, data: callMockData, value: 0};
      signatureToCall = calculateMessageSignature(privateKey, msgToCall);
    });

    it('called method', async () => {
      expect(await mockContract.wasCalled()).to.be.false;
      await identity.executeSigned(mockContract.address, 0, callMockData, 0, 0, ETHER, 0, OPERATION_CALL, signatureToCall);
      expect(await mockContract.wasCalled()).to.be.true;
    });
    
    it('increase nonce', async () => {
      await identity.executeSigned(mockContract.address, 0, callMockData, 0, 0, ETHER, 0, OPERATION_CALL, signatureToCall);
      expect(await identity.lastNonce()).to.eq(1);
    });

    xit('refunded');
  });

  describe('fails if invalid signature', () => {
    let anotherWallet;
    let invalidSignature;

    before(async () => {
      [anotherWallet] = await getWallets(provider);
      invalidSignature = calculateMessageSignature(anotherWallet.privateKey, msg);
    });

    it('no signature', async () => {
      await expect(identity.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, []))
        .to.be.revertedWith('Invalid signature');
      expect(await identity.lastNonce()).to.eq(0);
      expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
    });

    it('unknown wallet signature', async () => {
      await expect(identity.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, invalidSignature))
        .to.be.revertedWith('Invalid signature');
      expect(await identity.lastNonce()).to.eq(0);
      expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
    });

    it('nonce not increased', async () => {
      const lasNonceBefore = await identity.lastNonce();
      await expect(identity.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, invalidSignature))
        .to.be.revertedWith('Invalid signature');
      expect(await identity.lastNonce()).to.eq(lasNonceBefore);
    });
  });

  describe('shouldn`t fail if call fails', () => {
    it('increase nonce', async () => {
      const message = {...transferMessage, value: parseEther('10.0'), from: identity.address};
      const newSignature = calculateMessageSignature(privateKey, message);

      await identity.executeSigned(to, parseEther('10.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, newSignature);
      expect(await provider.getBalance(to)).to.eq(parseEther('0.0'));
      expect(await identity.lastNonce()).to.eq(1);
    });

    xit('refunded');
  });

  xdescribe('fails if not enough signatures', () => {
    xit('increase nonce');
    xit('refunded');
  });

  describe('successful execution of transfer (multiple keys)', () => {
    xit('transfered funds');
    xit('increase nonce');
    xit('refunded');
  });

  xdescribe('fails if not enough balance to refund', () => {
    xit('increase nonce');
    xit('refunded');
  });

  xdescribe('successful execution of create');
  xdescribe('successful execution of delegate call');
});
