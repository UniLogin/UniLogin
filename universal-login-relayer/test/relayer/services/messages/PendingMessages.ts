import {expect} from 'chai';
import {Wallet, Contract, utils} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, createSignedMessage, SignedMessage, MessageStatus} from '@universal-login/commons';
import PendingMessage from '../../../../lib/services/messages/PendingMessage';
import PendingMessages from '../../../../lib/services/messages/PendingMessages';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import PendingMessagesStore from '../../../../lib/services/messages/PendingMessagesStore';
import {getKeyFromHashAndSignature} from '../../../../lib/utils/utils';

describe('INT: PendingMessages', () => {
  let pendingMessages : PendingMessages;
  let message : SignedMessage;
  let wallet: Wallet;
  let walletContract: Contract;
  let actionKey: string;

  beforeEach(async () => {
    ({ wallet, walletContract, actionKey } = await loadFixture(basicWalletContractWithMockToken));
    const pendingMessagesStore = new PendingMessagesStore();
    pendingMessages = new PendingMessages(wallet, pendingMessagesStore);
    message = await createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);
    await walletContract.setRequiredSignatures(2);
  });

  it('not present initally', () => {
    expect(pendingMessages.isPresent('0x0123')).to.be.false;
  });

  it('should be addded', async () => {
    const hash = await pendingMessages.add(message);
    expect(pendingMessages.isPresent(hash)).to.be.true;
  });

  it('getStatus should throw error', async () => {
    const hash = calculateMessageHash(message);
    await expect(pendingMessages.getStatus(hash)).to.eventually.rejectedWith(`Could not find execution with hash: ${hash}`);
  });

  it('get should throw error if message doesn`t exist', async () => {
    const hash = calculateMessageHash(message);
    await expect(() => pendingMessages.get(hash)).to.throw(`Could not find execution with hash: ${hash}`);
  });

  it('should check if execution is ready to execute', async () => {
    const signedMessage = await createSignedMessage(message, actionKey);
    const hash1 = await pendingMessages.add(message);
    expect(await pendingMessages.isEnoughSignatures(hash1)).to.eq(false);
    const hash2 = await pendingMessages.add(signedMessage);
    expect(await pendingMessages.isEnoughSignatures(hash2)).to.eq(true);
  });

  it('should return message with signature', async () => {
    const hash = await pendingMessages.add(message);
    const messageWithSignaures = await pendingMessages.getMessageWithSignatures(message, hash);
    expect(messageWithSignaures).to.deep.eq(message);
  });

  it('should get added signed transaction', async () => {
    const pendingMessage = new PendingMessage(message.from, wallet);
    const hash = await pendingMessages.add(message);

    const key = getKeyFromHashAndSignature(hash, message.signature);
    await pendingMessage.collectedSignatures.push({signature: message.signature, key});
    expect(pendingMessages.get(hash).toString()).to.eq(pendingMessage.toString());
  });

  describe('Add', async () => {

    it('should push one signature', async () => {
      const hash = await pendingMessages.add(message);
      const status = await pendingMessages.getStatus(hash) as MessageStatus;
      const {collectedSignatures} = status;
      expect(status.collectedSignatures.length).to.be.eq(1);
      expect(collectedSignatures[0]).to.be.eq(message.signature);
    });

    it('should sign message', async () => {
      const signedMessage = await createSignedMessage(message, actionKey);
      const hash1 = await pendingMessages.add(message);
      const hash2 = await pendingMessages.add(signedMessage);
      expect(hash1).to.be.eq(hash2);
      const collectedSignatures = (await pendingMessages.getStatus(hash1) as MessageStatus).collectedSignatures;
      expect(collectedSignatures).to.be.deep.eq([message.signature, signedMessage.signature]);
    });

    it('should not push invalid key purpose', async () => {
      const message2 = await createSignedMessage({from: wallet.address, to: '0x'}, actionKey);
      await expect(pendingMessages.add({...message, signature: message2.signature})).to.be.rejectedWith('Invalid key purpose');
    });

    it('should not accept same signature twice', async () => {
      await pendingMessages.add(message);
      await expect(pendingMessages.add(message))
          .to.be.rejectedWith('Signature already collected');
    });

    it('should not accept same signature twice', async () => {
      const message2 = await createSignedMessage({from: walletContract.address, to: '0x'}, actionKey);
      await walletContract.setRequiredSignatures(1);
      const hash = await pendingMessages.add(message);
      pendingMessages.confirmExecution(hash, '0x829751e6e6b484a2128924ce59c2ff518acf07fd345831f0328d117dfac30cec');
      await expect(pendingMessages.add(message2))
          .to.be.eventually.rejectedWith('Execution request already processed');
    });
  });
});
