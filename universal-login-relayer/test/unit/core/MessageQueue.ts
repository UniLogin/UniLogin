import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {calculateMessageHash, waitExpect, SignedMessage, TEST_TRANSACTION_HASH} from '@universal-login/commons';
import MessageQueueService from '../../../lib/core/services/messages/MessageQueueService';
import MessageQueueMemoryStore from '../../helpers/MessageQueueMemoryStore';
import getTestSignedMessage from '../../config/message';
import PendingMessagesMemoryStore from '../../helpers/PendingMessagesMemoryStore';
import {createPendingMessage} from '../../../lib/core/utils/utils';

use(sinonChai);

describe('UNIT: Message Queue Service', async () => {
  let messageQueueService: MessageQueueService;
  let messageQueueMemoryStorage: MessageQueueMemoryStore;
  let pendingMessagesMemoryStorage: PendingMessagesMemoryStore;
  const wallet = {
    provider: {waitForTransaction: sinon.fake()}
  };
  const executor: any = {
    executeAndWait: sinon.fake.returns({hash: TEST_TRANSACTION_HASH}),
    wallet
  };
  const executorReturnsNull: any = {
    executeAndWait: sinon.fake.returns(null),
    wallet
  };
  let signedMessage: SignedMessage;
  let messageHash: string;

  beforeEach(async () => {
    messageQueueMemoryStorage = new MessageQueueMemoryStore();
    pendingMessagesMemoryStorage = new PendingMessagesMemoryStore();
    messageQueueService = new MessageQueueService(executor, messageQueueMemoryStorage, pendingMessagesMemoryStorage, 1);
    signedMessage = await getTestSignedMessage();
    messageHash = calculateMessageHash(signedMessage);
    await pendingMessagesMemoryStorage.add(
      messageHash,
      createPendingMessage(signedMessage)
    );
  });

  it('signedMessage round trip', async () => {
    messageQueueService.start();
    await messageQueueService.add(signedMessage);
    await waitExpect(() => expect(executor.executeAndWait).to.be.calledOnce);
  });

  it('should execute pending signedMessage after start', async () => {
    await messageQueueService.add(signedMessage);
    messageQueueService.start();
    await waitExpect(() => expect(executor.executeAndWait).to.be.calledTwice);
  });

  it('should throw error when hash is null', async () => {
    messageQueueService = new MessageQueueService(executorReturnsNull, messageQueueMemoryStorage, pendingMessagesMemoryStorage, 1);
    messageQueueService.start();
    const markAsErrorSpy = sinon.spy(pendingMessagesMemoryStorage.markAsError);
    pendingMessagesMemoryStorage.markAsError = markAsErrorSpy;
    messageQueueMemoryStorage.remove = sinon.spy(messageQueueMemoryStorage.remove);
    await pendingMessagesMemoryStorage.add(messageHash, createPendingMessage(signedMessage));
    messageHash = await messageQueueService.add(signedMessage);
    await waitExpect(() => expect(pendingMessagesMemoryStorage.markAsError).calledWith(messageHash, 'TypeError: Cannot read property \'hash\' of null'));
    expect(messageQueueMemoryStorage.remove).to.be.calledOnce;
    expect(messageQueueMemoryStorage.remove).to.be.calledAfter(markAsErrorSpy);
  });

  afterEach(async () => {
    await messageQueueService.stopLater();
  });
});
