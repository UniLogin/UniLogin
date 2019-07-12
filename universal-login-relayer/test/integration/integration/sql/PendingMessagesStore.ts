import {expect} from 'chai';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, createSignedMessage, SignedMessage, TEST_TRANSACTION_HASH, bignumberifySignedMessageFields, stringifySignedMessageFields} from '@universal-login/commons';
import IPendingMessagesStore from '../../../../lib/core/services/messages/IPendingMessagesStore';
import MessageItem from '../../../../lib/core/models/messages/MessageItem';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import {getKeyFromHashAndSignature, createPendingMessage} from '../../../../lib/core/utils/utils';
import {getKnex} from '../../../../lib/core/utils/knexUtils';
import PendingMessagesSQLStore from '../../../../lib/integration/sql/services/PendingMessagesSQLStore';
import PendingMessagesMemoryStore from '../../../helpers/PendingMessagesMemoryStore';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

for (const config of [{
    type: PendingMessagesSQLStore,
  }, {
    type: PendingMessagesMemoryStore,
  }]
) {
describe(`INT: IPendingMessageStore (${config.type.name})`, async () => {
  let pendingMessagesStore: IPendingMessagesStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: SignedMessage;
  let messageItem: MessageItem;
  let messageHash: string;
  let actionKey: string;
  const knex = getKnex();

  beforeEach(async () => {
    ({wallet, walletContract, actionKey} = await loadFixture(basicWalletContractWithMockToken));
    let args: any;
    if (config.type.name.includes('SQL')) {
      args = knex;
    }
    pendingMessagesStore = new config.type(args);
    message = await createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);

    messageItem = createPendingMessage(message);
    messageHash = calculateMessageHash(message);
  });

  afterEach(async () => {
    config.type.name.includes('SQL') && await clearDatabase(knex);
  });

  it('roundtrip', async () => {
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(false, 'store is not initially empty');
    await pendingMessagesStore.add(messageHash, messageItem);
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(true);
    messageItem.message = bignumberifySignedMessageFields(stringifySignedMessageFields(messageItem.message));
    expect(await pendingMessagesStore.get(messageHash)).to.be.deep.eq(messageItem);
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(true);
    const removedPendingExecution = await pendingMessagesStore.remove(messageHash);
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(false);
    expect(removedPendingExecution).to.be.deep.eq(messageItem);
  });

  it('containSignature should return false if signature not collected', async () => {
    expect(await pendingMessagesStore.containSignature(messageHash, message.signature)).to.be.false;
  });

  it('containSignature should return true if signature already collected', async () => {
    await pendingMessagesStore.add(messageHash, messageItem);
    await pendingMessagesStore.addSignature(messageHash, message.signature);
    expect(await pendingMessagesStore.containSignature(messageHash, message.signature)).to.be.true;
  });

  it('getStatus if message doesn`t exist', async () => {
    await expect(pendingMessagesStore.getStatus(messageHash, wallet)).to.be.eventually.rejectedWith(`Could not find message with hash: ${messageHash}`);
  });

  it('getStatus roundtrip', async () => {
    await pendingMessagesStore.add(messageHash, messageItem);
    const expectedStatus = {
      collectedSignatures: [] as any,
      totalCollected: 0,
      required: 1,
      state: 'AwaitSignature'
    };
    expect(await pendingMessagesStore.getStatus(messageHash, wallet)).to.deep.eq(expectedStatus);
    await pendingMessagesStore.addSignature(messageHash, message.signature);
    expect(await pendingMessagesStore.getStatus(messageHash, wallet)).to.deep.eq(
      {
        ...expectedStatus,
        collectedSignatures: [message.signature],
        totalCollected: 1
      });
  });

  it('should add signature', async () => {
    await walletContract.setRequiredSignatures(2);
    await pendingMessagesStore.add(messageHash, messageItem);
    const message2 = await createSignedMessage({from: walletContract.address, to: '0x'}, actionKey);
    await pendingMessagesStore.addSignature(messageHash, message2.signature);
    const status = await pendingMessagesStore.getStatus(messageHash, wallet);
    expect(status.collectedSignatures).to.contains(message2.signature);
  });

  it('should update transaction hash', async () => {
    await pendingMessagesStore.add(messageHash, messageItem);
    const expectedTransactionHash = TEST_TRANSACTION_HASH;
    await pendingMessagesStore.markAsSuccess(messageHash, expectedTransactionHash);
    const {transactionHash} = await pendingMessagesStore.getStatus(messageHash, wallet);
    expect(transactionHash).to.be.eq(expectedTransactionHash);
  });

  it('should update error', async () => {
    await pendingMessagesStore.add(messageHash, messageItem);
    const expectedMessageError = 'Pending Message Store Error';
    await pendingMessagesStore.markAsError(messageHash, expectedMessageError);
    const {error} = await pendingMessagesStore.getStatus(messageHash, wallet);
    expect(error).to.be.eq(expectedMessageError);
  });

  it('should throw error if signed message is missed', async () => {
    delete messageItem.message;
    await expect(pendingMessagesStore.add(messageHash, messageItem)).to.rejectedWith(`SignedMessage not found for hash: ${messageHash}`);
  });

  it('should get signatures', async () => {
    await pendingMessagesStore.add(messageHash, messageItem);
    await pendingMessagesStore.addSignature(messageHash, message.signature);
    const key = getKeyFromHashAndSignature(messageHash, message.signature);
    expect(await pendingMessagesStore.getCollectedSignatureKeyPairs(messageHash)).to.be.deep.eq([{key, signature: message.signature}]);
    const {signature} = await createSignedMessage({from: walletContract.address, to: '0x'}, actionKey);
    await pendingMessagesStore.addSignature(messageHash, signature);
    const key2 = getKeyFromHashAndSignature(messageHash, signature);
    expect(await pendingMessagesStore.getCollectedSignatureKeyPairs(messageHash)).to.be.deep.eq([{key, signature: message.signature}, {key: key2, signature}]);
  });

  after(async () => {
    await knex.destroy();
  });
});
}
