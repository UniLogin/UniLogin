import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {calculateMessageHash, waitExpect, SignedMessage, TEST_TRANSACTION_HASH} from '@universal-login/commons';
import QueueService from '../../../lib/core/services/messages/QueueService';
import QueueMemoryStore from '../../helpers/QueueMemoryStore';
import getTestSignedMessage from '../../config/message';
import MessageMemoryRepository from '../../helpers/MessageMemoryRepository';
import {createMessageItem} from '../../../lib/core/utils/messages/serialisation';
import IMessageRepository from '../../../lib/core/services/messages/IMessagesRepository';

use(sinonChai);

describe('UNIT: Queue Service', async () => {
  let queueService: QueueService;
  let queueMemoryStore: QueueMemoryStore;
  let messageRepository: IMessageRepository;
  const wait = sinon.spy();
  const onTransactionMined = sinon.spy();
  const executor: any = {
    canExecute: sinon.fake.returns(true),
    execute: sinon.fake.returns({
      hash: TEST_TRANSACTION_HASH,
      wait
    }),
  };
  const executorReturnsNull: any = {
    canExecute: sinon.fake.returns(true),
    execute: sinon.fake.returns(null),
  };
  const executorCannotExecute: any = {
    canExecute: sinon.fake.returns(false),
    execute: sinon.fake.returns(null),
  };
  let signedMessage: SignedMessage;
  let messageHash: string;

  beforeEach(async () => {
    queueMemoryStore = new QueueMemoryStore();
    messageRepository = new MessageMemoryRepository();
    queueService = new QueueService(executor, queueMemoryStore, messageRepository, onTransactionMined, 1);
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
    expect(wait).to.be.calledAfter(executor.execute);
    expect(onTransactionMined).to.be.calledImmediatelyAfter(wait);
    expect(wait).to.be.calledOnce;
    expect(onTransactionMined).to.be.calledOnce;
  });

  it('should execute pending signedMessage after start', async () => {
    await queueService.add(signedMessage);
    queueService.start();
    await waitExpect(() => expect(executor.execute).to.be.calledOnce);
    expect(wait).to.be.calledAfter(executor.execute);
  });

  it('should throw error when hash is null', async () => {
    queueService = new QueueService(executorReturnsNull, queueMemoryStore, messageRepository, onTransactionMined, 1);
    queueService.start();
    const markAsErrorSpy = sinon.spy(messageRepository.markAsError);
    messageRepository.markAsError = markAsErrorSpy;
    queueMemoryStore.remove = sinon.spy(queueMemoryStore.remove);
    await messageRepository.add(messageHash, createMessageItem(signedMessage));
    messageHash = await queueService.add(signedMessage);
    await waitExpect(() => expect(messageRepository.markAsError).calledWith(messageHash, 'TypeError: Cannot read property \'hash\' of null'));
    expect(queueMemoryStore.remove).to.be.calledOnce;
    expect(queueMemoryStore.remove).to.be.calledAfter(markAsErrorSpy);
    expect(onTransactionMined).to.be.not.called;
  });

  it('should not execute if the executor cannot execute, but remove from the queue', async () => {
    queueService = new QueueService(executorCannotExecute, queueMemoryStore, messageRepository, onTransactionMined, 1);
    queueService.start();
    queueMemoryStore.remove = sinon.spy(queueMemoryStore.remove);
    await messageRepository.add(messageHash, createMessageItem(signedMessage));
    messageHash = await queueService.add(signedMessage);

    await waitExpect(() => expect(queueMemoryStore.remove).to.be.calledOnce, 3000);
    expect(executorCannotExecute.canExecute).to.be.calledOnce;
    expect(executorCannotExecute.execute).to.not.be.called;
  });

  afterEach(async () => {
    await queueService.stopLater();
  });
});
