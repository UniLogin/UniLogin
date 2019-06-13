import {expect} from 'chai';
import sinon, {SinonSpy} from 'sinon';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, createSignedMessage, SignedMessage, TEST_TRANSACTION_HASH, TEST_MESSAGE_HASH} from '@universal-login/commons';
import PendingMessages from '../../../../lib/services/messages/PendingMessages';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import PendingMessagesSQLStore from '../../../../lib/services/messages/PendingMessagesSQLStore';
import {getKeyFromHashAndSignature, createPendingMessage} from '../../../../lib/utils/utils';
import { getKnex } from '../../../../lib/utils/knexUtils';
import {clearDatabase} from '../../../../lib/utils/relayerUnderTest';

describe('INT: PendingMessages', () => {
  let pendingMessages : PendingMessages;
  let message : SignedMessage;
  let wallet: Wallet;
  let walletContract: Contract;
  let actionKey: string;
  const knex = getKnex();
  let spy: SinonSpy;
  let messageHash: string;

  beforeEach(async () => {
    ({ wallet, walletContract, actionKey } = await loadFixture(basicWalletContractWithMockToken));
    const pendingMessagesStore = new PendingMessagesSQLStore(knex);
    spy = sinon.fake.returns({hash: '0x0000000000000000000000000000000000000000000000000000000000000000'});
    pendingMessages = new PendingMessages(wallet, pendingMessagesStore, {add: spy} as any);
    message = await createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);
    messageHash = calculateMessageHash(message);
    await walletContract.setRequiredSignatures(2);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  it('not present initally', async () => {
    expect(await pendingMessages.isPresent(TEST_MESSAGE_HASH)).to.be.false;
  });

  it('should be addded', async () => {
    await pendingMessages.add(message);
    expect(await pendingMessages.isPresent(messageHash)).to.be.true;
  });

  it('getStatus should throw error', async () => {
    await expect(pendingMessages.getStatus(messageHash)).to.eventually.rejectedWith(`Could not find message with hash: ${messageHash}`);
  });

  it('get should throw error if message doesn`t exist', async () => {
    await expect(pendingMessages.get(messageHash)).to.eventually.rejectedWith(`Could not find message with hash: ${messageHash}`);
  });

  it('should check if execution is ready to execute and execution callback', async () => {
    const signedMessage = await createSignedMessage(message, actionKey);
    await pendingMessages.add(message);
    expect(await pendingMessages.isEnoughSignatures(messageHash)).to.eq(false);
    expect(spy.calledOnce).to.be.false;
    await pendingMessages.add(signedMessage);
    expect(spy.calledOnce).to.be.true;
  });

  it('should return message with signature', async () => {
    await pendingMessages.add(message);
    const messageWithSignaures = await pendingMessages.getMessageWithSignatures(message, messageHash);
    expect(messageWithSignaures).to.deep.eq(message);
  });

  it('should get added signed transaction', async () => {
    const pendingMessage = createPendingMessage(message.from);
    await pendingMessages.add(message);
    const key = getKeyFromHashAndSignature(messageHash, message.signature);
    await pendingMessage.collectedSignatureKeyPairs.push({signature: message.signature, key});
    expect((await pendingMessages.get(messageHash)).toString()).to.eq(pendingMessage.toString());
  });

  describe('Add', async () => {

    it('should push one signature', async () => {
      await pendingMessages.add(message);
      const status = await pendingMessages.getStatus(messageHash);
      const {collectedSignatures} = status;
      expect(status.collectedSignatures.length).to.be.eq(1);
      expect(collectedSignatures[0]).to.be.eq(message.signature);
    });

    it('should sign message', async () => {
      const signedMessage = await createSignedMessage(message, actionKey);
      await pendingMessages.add(message);
      await pendingMessages.add(signedMessage);
      const collectedSignatures = (await pendingMessages.getStatus(messageHash)).collectedSignatures;
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
  });

  describe('Confirm message', async () => {
    it('should not confirm message with invalid transaction hash', async () => {
      await pendingMessages.add(message);
      const expectedTransactionHash = TEST_TRANSACTION_HASH;
      await pendingMessages.confirmExecution(messageHash, expectedTransactionHash);
      const {transactionHash} = await pendingMessages.getStatus(messageHash);
      expect(transactionHash).to.be.eq(expectedTransactionHash);
    });

    it('should throw InvalidTransaction if transactionHash is not correct', async () => {
      await pendingMessages.add(message);
      await expect(pendingMessages.confirmExecution(messageHash, '0x1234')).to.eventually.be.rejectedWith('Invalid transaction: 0x1234');
    });
  });

  describe('Ensure correct execution', async () =>  {
    it('should throw when pending message already has transaction hash', async () => {
      await walletContract.setRequiredSignatures(1);
      await pendingMessages.add(message);
      await pendingMessages.confirmExecution(messageHash, '0x829751e6e6b484a2128924ce59c2ff518acf07fd345831f0328d117dfac30cec');
      await expect(pendingMessages.ensureCorrectExecution(messageHash))
          .to.be.eventually.rejectedWith('Execution request already processed');
    });

    it('should throw error when pending message has not enough signatures', async () => {
      await pendingMessages.add(message);
      await expect(pendingMessages.ensureCorrectExecution(messageHash))
        .to.be.eventually.rejectedWith('Not enough signatures, required 2, got only 1');
    });
  });

  after(async () => {
    await knex.destroy();
  });
});
