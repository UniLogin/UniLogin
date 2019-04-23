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
    expect((await transactionQueueStore.getNext()).id).to.be.equal(idFirst);
    await transactionQueueStore.remove(idFirst, {hash: '0x000'});
    expect((await transactionQueueStore.getNext()).id).to.be.equal(idSecond);
    await transactionQueueStore.remove(idSecond, {hash: '0x000'});
    expect(await transactionQueueStore.getNext()).to.be.undefined;
  });

  afterEach(async () => {
    await transactionQueueStore.database.delete().from('transactions');
    await transactionQueueStore.database.destroy();
  });
});
