import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {calculateMessageHash, waitExpect, SignedMessage, TEST_TRANSACTION_HASH} from '@universal-login/commons';
import MessageQueueService from '../../../lib/core/services/messages/MessageQueueService';
import QueueMemoryStore from '../../helpers/QueueMemoryStore';
import getTestSignedMessage from '../../config/message';
import MessageMemoryRepository from '../../helpers/MessageMemoryRepository';
import {createMessageItem} from '../../../lib/core/utils/utils';
import IMessageRepository from '../../../lib/core/services/messages/IMessagesRepository';

use(sinonChai);

describe('UNIT: Message Queue Service', async () => {
  let messageQueueService: MessageQueueService;
  let queueMemoryStore: QueueMemoryStore;
  let messageRepository: IMessageRepository;
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
    queueMemoryStore = new QueueMemoryStore();
    messageRepository = new MessageMemoryRepository();
    messageQueueService = new MessageQueueService(executor, queueMemoryStore, messageRepository, 1);
    signedMessage = await getTestSignedMessage();
    messageHash = calculateMessageHash(signedMessage);
    await messageRepository.add(
      messageHash,
      createMessageItem(signedMessage)
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
    messageQueueService = new MessageQueueService(executorReturnsNull, queueMemoryStore, messageRepository, 1);
    messageQueueService.start();
    const markAsErrorSpy = sinon.spy(messageRepository.markAsError);
    messageRepository.markAsError = markAsErrorSpy;
    queueMemoryStore.remove = sinon.spy(queueMemoryStore.remove);
    await messageRepository.add(messageHash, createMessageItem(signedMessage));
    messageHash = await messageQueueService.add(signedMessage);
    await waitExpect(() => expect(messageRepository.markAsError).calledWith(messageHash, 'TypeError: Cannot read property \'hash\' of null'));
    expect(queueMemoryStore.remove).to.be.calledOnce;
    expect(queueMemoryStore.remove).to.be.calledAfter(markAsErrorSpy);
  });

  afterEach(async () => {
    await messageQueueService.stopLater();
  });
});
