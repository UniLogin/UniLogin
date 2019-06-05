import {expect} from 'chai';
import {utils} from 'ethers';
import {getKnex} from '../../../../lib/utils/knexUtils';
import TransactionQueueStore from '../../../../lib/services/transactions/TransactionQueueStore';
import {SignedMessage, createSignedMessage, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {getSignedMessage, testPrivateKey} from '../../../config/message';

describe('INT: Transaction Queue Store', async () => {
  let transactionQueueStore: TransactionQueueStore;
  let signedMessage: SignedMessage;

  before(async () => {
    signedMessage = await getSignedMessage();
  });

  beforeEach(async () => {
    transactionQueueStore = new TransactionQueueStore(getKnex());
  });

  it('construction: queue is empty', async () =>  {
    const nextTransaction = await transactionQueueStore.getNext();
    expect(nextTransaction).to.be.undefined;
  });

  it('addTransaction', async () =>  {
    const [idFirst] = await transactionQueueStore.add(signedMessage);

    expect(idFirst).to.be.a('number');
    expect(idFirst).to.be.at.least(1);
  });

  it('transaction round trip', async () => {
    const [idFirst] = await transactionQueueStore.add(signedMessage);
    const signedMessage2 = await createSignedMessage({from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('2')}, testPrivateKey);
    const [idSecond] = await transactionQueueStore.add(signedMessage2);
    const id = (await transactionQueueStore.getNext()).id;
    expect(id).to.be.equal(idFirst);
    expect(id).to.be.a('number');
    expect(id).to.be.at.least(1);
    await transactionQueueStore.onSuccessRemove(idFirst, '0x000');
    const id2 = (await transactionQueueStore.getNext()).id;
    expect(id2).to.be.equal(idSecond);
    expect(id2).to.be.a('number');
    expect(id2).to.be.at.least(2);
    await transactionQueueStore.onSuccessRemove(idSecond, '0x000');
    expect(await transactionQueueStore.getNext()).to.be.undefined;
  });

  afterEach(async () => {
    await transactionQueueStore.database.delete().from('transactions');
    await transactionQueueStore.database.destroy();
  });
});
