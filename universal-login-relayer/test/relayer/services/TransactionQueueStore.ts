import {expect} from 'chai';
import {utils} from 'ethers';
import {getKnex} from '../../../lib/utils/knexUtils';
import TransactionQueueStore from '../../../lib/services/TransactionQueueStore';
import transaction from '../../config/transaction';

const transaction2 = {
  ...transaction,
  value: utils.parseEther('2')
};

describe('INT: Transaction Queue Store', async () => {
  let transactionQueueStore: TransactionQueueStore;

  beforeEach(async () => {
    transactionQueueStore = new TransactionQueueStore(getKnex());
  });

  it('construction: queue is empty', async () =>  {
    const nextTransaction = await transactionQueueStore.getNext();
    expect(nextTransaction).to.be.undefined;
  });

  it('addTransaction', async () =>  {
    const [idFirst] = await transactionQueueStore.add(transaction);

    expect(idFirst).to.be.a('number');
    expect(idFirst).to.be.at.least(1);
  });

  it('transaction round trip', async () => {
    const [idFirst] = await transactionQueueStore.add(transaction);
    const [idSecond] = await transactionQueueStore.add(transaction2);
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
