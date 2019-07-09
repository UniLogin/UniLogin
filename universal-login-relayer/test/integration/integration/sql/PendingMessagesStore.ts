import {expect} from 'chai';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, createSignedMessage, SignedMessage, TEST_TRANSACTION_HASH} from '@universal-login/commons';
import IPendingMessagesStore from '../../../../lib/core/services/messages/IPendingMessagesStore';
import PendingMessage from '../../../../lib/core/models/messages/PendingMessage';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import {getKeyFromHashAndSignature, createPendingMessage} from '../../../../lib/core/utils/utils';
import {getKnex} from '../../../../lib/core/utils/knexUtils';
import PendingMessagesSQLStore from '../../../../lib/integration/sql/services/PendingMessagesSQLStore';
import PendingMessagesMemoryStore from '../../../helpers/PendingMessagesMemoryStore';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

for (const config of [{
    name: 'PendingMessagesSQLStore',
    type: PendingMessagesSQLStore,
  }, {
    type: PendingMessagesMemoryStore,
    name: 'PendingMessageMemoryStore',
  }]
) {
describe(`INT: IPendingMessageStore (${config.name})`, async () => {
  let pendingMessagesStore: IPendingMessagesStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: SignedMessage;
  let pendingMessage: PendingMessage;
  let messageHash: string;
  let actionKey: string;
  const knex = getKnex();

  beforeEach(async () => {
    ({wallet, walletContract, actionKey} = await loadFixture(basicWalletContractWithMockToken));
    let args: any;
    if (config.name.includes('SQL')) {
      args = knex;
    }
    pendingMessagesStore = new config.type(args);
    message = await createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);

    pendingMessage = createPendingMessage(message.from);
    messageHash = calculateMessageHash(message);
  });

  afterEach(async () => {
    config.name.includes('SQL') && await clearDatabase(knex);
  });

  it('roundtrip', async () => {
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(false, 'store is not initially empty');
    await pendingMessagesStore.add(messageHash, pendingMessage);
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(true);
    expect(await pendingMessagesStore.get(messageHash)).to.be.deep.eq(pendingMessage);
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(true);
    const removedPendingExecution = await pendingMessagesStore.remove(messageHash);
    expect(await pendingMessagesStore.isPresent(messageHash)).to.be.eq(false);
    expect(removedPendingExecution).to.be.deep.eq(pendingMessage);
  });

  it('containSignature should return false if signature not collected', async () => {
    expect(await pendingMessagesStore.containSignature(messageHash, message.signature)).to.be.false;
  });

  it('containSignature should return true if signature already collected', async () => {
    await pendingMessagesStore.add(messageHash, pendingMessage);
    await pendingMessagesStore.addSignature(messageHash, message.signature);
    expect(await pendingMessagesStore.containSignature(messageHash, message.signature)).to.be.true;
  });

  it('getStatus if message doesn`t exist', async () => {
    await expect(pendingMessagesStore.getStatus(messageHash, wallet)).to.be.eventually.rejectedWith(`Could not find message with hash: ${messageHash}`);
  });

  it('getStatus roundtrip', async () => {
    await pendingMessagesStore.add(messageHash, pendingMessage);
    const expectedStatus = {
      collectedSignatures: [] as any,
      totalCollected: 0,
      required: 1,
      transactionHash: null
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
    await pendingMessagesStore.add(messageHash, pendingMessage);
    const message2 = await createSignedMessage({from: walletContract.address, to: '0x'}, actionKey);
    await pendingMessagesStore.addSignature(messageHash, message2.signature);
    const status = await pendingMessagesStore.getStatus(messageHash, wallet);
    expect(status.collectedSignatures).to.contains(message2.signature);
  });

  it('should update transcaction hash', async () => {
    await pendingMessagesStore.add(messageHash, pendingMessage);
    const expectedTransactionHash = TEST_TRANSACTION_HASH;
    await pendingMessagesStore.markAsSuccess(messageHash, expectedTransactionHash);
    const {transactionHash} = await pendingMessagesStore.getStatus(messageHash, wallet);
    expect(transactionHash).to.be.eq(expectedTransactionHash);
  });

  it('should get signatures', async () => {
    await pendingMessagesStore.add(messageHash, pendingMessage);
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
