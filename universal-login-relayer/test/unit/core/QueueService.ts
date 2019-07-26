import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {calculateMessageHash, waitExpect, SignedMessage, TEST_TRANSACTION_HASH} from '@universal-login/commons';
import QueueService from '../../../lib/core/services/messages/QueueService';
import QueueMemoryStore from '../../helpers/QueueMemoryStore';
import getTestSignedMessage from '../../config/message';
import MessageMemoryRepository from '../../helpers/MessageMemoryRepository';
import {createMessageItem} from '../../../lib/core/utils/utils';
import IMessageRepository from '../../../lib/core/services/messages/IMessagesRepository';

use(sinonChai);

describe('UNIT: Queue Service', async () => {
  let queueService: QueueService;
  let queueMemoryStore: QueueMemoryStore;
  let messageRepository: IMessageRepository;
  const wallet = {
    provider: {waitForTransaction: sinon.fake()}
  };
  const executor: any = {
    execute: sinon.fake.returns({hash: TEST_TRANSACTION_HASH}),
    waitForTransaction: sinon.spy(),
    wallet
  };
  const executorReturnsNull: any = {
    execute: sinon.fake.returns(null),
    waitForTransaction: sinon.spy(),
    wallet
  };
  let signedMessage: SignedMessage;
  let messageHash: string;

  beforeEach(async () => {
    queueMemoryStore = new QueueMemoryStore();
    messageRepository = new MessageMemoryRepository();
    queueService = new QueueService(executor, queueMemoryStore, messageRepository, 1);
    signedMessage = getTestSignedMessage();
    messageHash = calculateMessageHash(signedMessage);
    await messageRepository.add(
      messageHash,
      createMessageItem(signedMessage)
    );
    sinon.resetHistory();
  });
  it('signedMessage round trip', async () => {
    queueService.start();
    await queueService.add(signedMessage);
    await waitExpect(() => expect(executor.execute).to.be.calledOnce);
    expect(executor.waitForTransaction).to.be.calledAfter(executor.execute);
    expect(executor.waitForTransaction).to.be.calledOnce;
  });

  it('should execute pending signedMessage after start', async () => {
    await queueService.add(signedMessage);
    queueService.start();
    await waitExpect(() => expect(executor.execute).to.be.calledOnce);
  });

  it('should throw error when hash is null', async () => {
    queueService = new QueueService(executorReturnsNull, queueMemoryStore, messageRepository, 1);
    queueService.start();
    const markAsErrorSpy = sinon.spy(messageRepository.markAsError);
    messageRepository.markAsError = markAsErrorSpy;
    queueMemoryStore.remove = sinon.spy(queueMemoryStore.remove);
    await messageRepository.add(messageHash, createMessageItem(signedMessage));
    messageHash = await queueService.add(signedMessage);
    await waitExpect(() => expect(messageRepository.markAsError).calledWith(messageHash, 'TypeError: Cannot read property \'hash\' of null'));
    expect(queueMemoryStore.remove).to.be.calledOnce;
    expect(queueMemoryStore.remove).to.be.calledAfter(markAsErrorSpy);
  });

  afterEach(async () => {
    await queueService.stopLater();
  });
});
