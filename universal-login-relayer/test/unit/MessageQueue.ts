import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {waitExpect, SignedMessage} from '@universal-login/commons';
import MessageQueueService from '../../lib/services/messages/MessageQueueService';
import MessageQueueMemoryStore from '../helpers/MessageQueueMemoryStore';
import getTestSignedMessage from '../config/message';

use(sinonChai);

describe('UNIT: Message Queue Service', async () => {
  let messageQueueService: MessageQueueService;
  let messageQueueMemoryStorage: MessageQueueMemoryStore;
  const wallet = {
    provider: {waitForTransaction: sinon.fake()}
  };
  const executor: any = {
    executeAndWait: sinon.fake.returns({hash: 'hash'}),
    wallet
  };
  const executorReturnsNull: any = {
    executeAndWait: sinon.fake.returns(null),
    wallet
  };
  let signedMessage: SignedMessage;

  beforeEach(async () => {
    messageQueueMemoryStorage = new MessageQueueMemoryStore();
    messageQueueService = new MessageQueueService(executor, messageQueueMemoryStorage, 1);
    signedMessage = await getTestSignedMessage();
  });

  it('signedMessage round trip', async () => {
    messageQueueService.start();
    await messageQueueService.add(signedMessage);

    await waitExpect(() => expect(executor.executeAndWait).to.be.calledOnce);
  });

  it('should execute signedMessage if id added before start', async () => {
    await messageQueueService.add(signedMessage);
    messageQueueService.start();
    await waitExpect(() => expect(executor.executeAndWait).to.be.calledTwice);
  });

  it('should throw error when hash is null', async () => {
    messageQueueService = new MessageQueueService(executorReturnsNull, messageQueueMemoryStorage, 1);
    messageQueueService.start();
    messageQueueMemoryStorage.onErrorRemove = sinon.spy(messageQueueMemoryStorage.onErrorRemove);
    await messageQueueService.add(signedMessage);
    await waitExpect(() => expect(messageQueueMemoryStorage.onErrorRemove).calledWith('1', 'TypeError: Cannot read property \'hash\' of null'));
  });

  afterEach(async () => {
    await messageQueueService.stopLater();
  });
});
