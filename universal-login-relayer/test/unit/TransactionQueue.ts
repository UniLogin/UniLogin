import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {utils} from 'ethers';
import {waitExpect, sleep} from '@universal-login/commons';
import TransactionQueueService from '../../lib/services/TransactionQueueService';
import transaction from '../config/transaction';

use(sinonChai);

class TransactionQueueArray {
  public database: Partial<utils.Transaction>[];
  constructor() {
    this.database = [];
  }
  add = (transaction: Partial<utils.Transaction>) => this.database.push(transaction);
  getNext = () => {const message = this.database.pop(); return message ? {message, id: '1'} : undefined; };
  remove = () => {};
}

describe('UNIT: Transaction Queue Service', async () => {
  let transactionQueueService: TransactionQueueService;
  const provider: any = {waitForTransaction: () => {}};
  const wallet: any = {sendTransaction: () => 'hash'};

  beforeEach(async () => {
    transactionQueueService = new TransactionQueueService(wallet, provider, new TransactionQueueArray() as any, 1);
  });

  it('transaction round trip', async () => {
    const spy = sinon.spy(transactionQueueService.execute);
    sinon.replace(transactionQueueService, 'execute', spy);

    transactionQueueService.start();
    await transactionQueueService.add(transaction);

    await waitExpect(() => expect(spy).to.be.calledOnce);
    await transactionQueueService.stop();

    await transactionQueueService.add(transaction);
    await sleep(2);
    expect(spy).to.be.calledOnce;

    transactionQueueService.start();
    await waitExpect(() => expect(spy).to.be.calledTwice);
  });

  afterEach(async () => { await transactionQueueService.stop(); });
});
