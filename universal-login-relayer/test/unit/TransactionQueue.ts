import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {waitExpect} from '@universal-login/commons';
import TransactionQueueService from '../../lib/services/transactions/TransactionQueueService';
import transaction from '../config/transaction';
import TransactionQueueMemoryStore from '../../lib/services/transactions/TransactionQueueMemoryStore';

use(sinonChai);

describe('UNIT: Transaction Queue Service', async () => {
  let transactionQueueService: TransactionQueueService;
  let transactionQueueMemoryStorage: TransactionQueueMemoryStore;
  const provider: any = {waitForTransaction: sinon.fake()};
  const wallet: any = {sendTransaction: sinon.fake.returns({hash: 'hash'})};
  const walletReturnsNull: any = {sendTransaction: sinon.fake.returns(null)};

  beforeEach(async () => {
    transactionQueueMemoryStorage = new TransactionQueueMemoryStore();
    transactionQueueService = new TransactionQueueService(wallet, provider, transactionQueueMemoryStorage as any, 1);
  });

  it('transaction round trip', async () => {
    transactionQueueService.start();
    await transactionQueueService.add(transaction);

    await waitExpect(() => expect(wallet.sendTransaction).to.be.calledOnce);
    expect(provider.waitForTransaction).to.be.calledOnce.and.calledAfter(wallet.sendTransaction);
  });

  it('should execute transaction if id added before start', async () => {
    await transactionQueueService.add(transaction);
    transactionQueueService.start();
    await waitExpect(() => expect(wallet.sendTransaction).to.be.calledTwice);
    expect(provider.waitForTransaction).to.be.calledTwice.and.calledAfter(wallet.sendTransaction);
  });

  it('should throw error when hash is null', async () => {
    transactionQueueService = new TransactionQueueService(walletReturnsNull, provider, transactionQueueMemoryStorage as any, 1);
    transactionQueueService.start();
    transactionQueueMemoryStorage.onErrorRemove = sinon.spy(transactionQueueMemoryStorage.onErrorRemove);
    await transactionQueueService.add(transaction);
    await waitExpect(() => expect(transactionQueueMemoryStorage.onErrorRemove).calledWith('1', 'TypeError: Cannot read property \'hash\' of null'));
  });

  afterEach(async () => {
    await transactionQueueService.stopLater();
  });
});
