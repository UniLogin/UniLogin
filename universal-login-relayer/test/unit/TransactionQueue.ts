import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {utils} from 'ethers';
import {waitExpect, sleep} from '@universal-login/commons';
import TransactionQueueService from '../../lib/services/TransactionQueueService';
import transaction from '../config/transaction';

use(sinonChai);

class TransactionQueueMemoryStorage {
  public database: Partial<utils.Transaction>[];
  constructor() {
    this.database = [];
  }
  add = async (transaction: Partial<utils.Transaction>) => this.database.push(transaction);
  getNext = async () => {const message = this.database[0]; return message ? {message, id: '1'} : undefined; };
  onSuccessRemove = async (id: string, hash: string) => this.database.pop();
  onErrorRemove = async (id: string, error: string) => this.database.pop();
}

describe('UNIT: Transaction Queue Service', async () => {
  let transactionQueueService: TransactionQueueService;
  let transactionQueueMemoryStorage: TransactionQueueMemoryStorage;
  const provider: any = {waitForTransaction: () => {}};
  const wallet: any = {sendTransaction: () => 'hash'};
  const walletReturnsNull: any = {sendTransaction: () => null};

  beforeEach(async () => {
    transactionQueueMemoryStorage = new TransactionQueueMemoryStorage();
    transactionQueueService = new TransactionQueueService(wallet, provider, transactionQueueMemoryStorage as any, 1);
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

  it('should throw error when hash is null', async () => {
    transactionQueueService = new TransactionQueueService(walletReturnsNull, provider, transactionQueueMemoryStorage as any, 1);
    transactionQueueService.start();
    transactionQueueMemoryStorage.onErrorRemove = sinon.spy(transactionQueueMemoryStorage.onErrorRemove);
    await transactionQueueService.add(transaction);
    await waitExpect(() => expect(transactionQueueMemoryStorage.onErrorRemove).calledWith('1', 'TypeError: Cannot read property \'hash\' of null'));
  });

  afterEach(async () => { await transactionQueueService.stop(); });
});
