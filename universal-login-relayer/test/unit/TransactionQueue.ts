import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {waitExpect, SignedMessage, createSignedMessage, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import TransactionQueueService from '../../lib/services/transactions/TransactionQueueService';
import TransactionQueueMemoryStore from '../../lib/services/transactions/TransactionQueueMemoryStore';

use(sinonChai);

describe('UNIT: Transaction Queue Service', async () => {
  const privateKey = '0x63f01680950dc70f2eb8f373de0c360fcbb89ef437f2f6f2f0a1797979e490a4';
  let transactionQueueService: TransactionQueueService;
  let transactionQueueMemoryStorage: TransactionQueueMemoryStore;
  const provider: any = {waitForTransaction: sinon.fake()};
  const wallet: any = {sendTransaction: sinon.fake.returns({hash: 'hash'})};
  const walletReturnsNull: any = {sendTransaction: sinon.fake.returns(null)};
  let signedMessage: SignedMessage;

  beforeEach(async () => {
    transactionQueueMemoryStorage = new TransactionQueueMemoryStore();
    transactionQueueService = new TransactionQueueService(wallet, provider, transactionQueueMemoryStorage, 1);
    signedMessage = await createSignedMessage({from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS}, privateKey);
  });

  it('signedMessage round trip', async () => {
    transactionQueueService.start();
    await transactionQueueService.add(signedMessage);

    await waitExpect(() => expect(wallet.sendTransaction).to.be.calledOnce);
    expect(provider.waitForTransaction).to.be.calledOnce.and.calledAfter(wallet.sendTransaction);
  });

  it('should execute signedMessage if id added before start', async () => {
    await transactionQueueService.add(signedMessage);
    transactionQueueService.start();
    await waitExpect(() => expect(wallet.sendTransaction).to.be.calledTwice);
    expect(provider.waitForTransaction).to.be.calledTwice.and.calledAfter(wallet.sendTransaction);
  });

  it('should throw error when hash is null', async () => {
    transactionQueueService = new TransactionQueueService(walletReturnsNull, provider, transactionQueueMemoryStorage, 1);
    transactionQueueService.start();
    transactionQueueMemoryStorage.onErrorRemove = sinon.spy(transactionQueueMemoryStorage.onErrorRemove);
    await transactionQueueService.add(signedMessage);
    await waitExpect(() => expect(transactionQueueMemoryStorage.onErrorRemove).calledWith('1', 'TypeError: Cannot read property \'hash\' of null'));
  });

  it('should call calback', async () => {
    const callback = sinon.spy();
    transactionQueueService.setOnTransactionSent(callback);
    transactionQueueService.start();
    transactionQueueService.add(signedMessage);
    await waitExpect(() => expect(callback).to.be.calledOnce);
  });

  afterEach(async () => {
    await transactionQueueService.stopLater();
  });
});
