import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {waitExpect, SignedMessage} from '@universal-login/commons';
import MessageQueueService from '../../lib/services/messages/MessageQueueService';
import MessageQueueMemoryStore from '../../lib/services/messages/MessageQueueMemoryStore';
import getTestSignedMessage from '../config/message';

use(sinonChai);

describe('UNIT: Message Queue Service', async () => {
  let messageQueueService: MessageQueueService;
  let messageQueueMemoryStorage: MessageQueueMemoryStore;
  const provider: any = {waitForTransaction: sinon.fake()};
  const wallet: any = {sendTransaction: sinon.fake.returns({hash: 'hash'})};
  const walletReturnsNull: any = {sendTransaction: sinon.fake.returns(null)};
  let signedMessage: SignedMessage;

  beforeEach(async () => {
    messageQueueMemoryStorage = new MessageQueueMemoryStore();
    messageQueueService = new MessageQueueService(wallet, provider, messageQueueMemoryStorage, 1);
    signedMessage = await getTestSignedMessage();
  });

  it('signedMessage round trip', async () => {
    messageQueueService.start();
    await messageQueueService.add(signedMessage);

    await waitExpect(() => expect(wallet.sendTransaction).to.be.calledOnce);
    expect(provider.waitForTransaction).to.be.calledOnce.and.calledAfter(wallet.sendTransaction);
  });

  it('should execute signedMessage if id added before start', async () => {
    await messageQueueService.add(signedMessage);
    messageQueueService.start();
    await waitExpect(() => expect(wallet.sendTransaction).to.be.calledTwice);
    expect(provider.waitForTransaction).to.be.calledTwice.and.calledAfter(wallet.sendTransaction);
  });

  it('should throw error when hash is null', async () => {
    messageQueueService = new MessageQueueService(walletReturnsNull, provider, messageQueueMemoryStorage, 1);
    messageQueueService.start();
    messageQueueMemoryStorage.onErrorRemove = sinon.spy(messageQueueMemoryStorage.onErrorRemove);
    await messageQueueService.add(signedMessage);
    await waitExpect(() => expect(messageQueueMemoryStorage.onErrorRemove).calledWith('1', 'TypeError: Cannot read property \'hash\' of null'));
  });

  it('should call calback', async () => {
    const callback = sinon.spy();
    messageQueueService.setOnTransactionSent(callback);
    messageQueueService.start();
    messageQueueService.add(signedMessage);
    await waitExpect(() => expect(callback).to.be.calledOnce);
  });

  afterEach(async () => {
    await messageQueueService.stopLater();
  });
});
