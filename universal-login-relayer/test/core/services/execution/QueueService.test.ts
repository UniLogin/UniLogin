import {calculateMessageHash, SignedMessage, TEST_TRANSACTION_HASH} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import {expect, use} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {constants} from 'ethers';
import Deployment from '../../../../src/core/models/Deployment';
import IMessageRepository from '../../../../src/core/models/messages/IMessagesRepository';
import IRepository from '../../../../src/core/models/messages/IRepository';
import ExecutionWorker from '../../../../src/core/services/execution/ExecutionWorker';
import {messageToTransaction} from '../../../../src/core/utils/messages/serialisation';
import DeploymentExecutor from '../../../../src/integration/ethereum/DeploymentExecutor';
import MessageExecutor from '../../../../src/integration/ethereum/MessageExecutor';
import {WalletDeploymentService} from '../../../../src/integration/ethereum/WalletDeploymentService';
import {getTestSignedMessage} from '../../../testconfig/message';
import MemoryRepository from '../../../mock/MemoryRepository';
import MessageMemoryRepository from '../../../mock/MessageMemoryRepository';
import QueueMemoryStore from '../../../mock/QueueMemoryStore';
import {createTestMessageItem} from '../../../testhelpers/createTestMessageItem';

use(sinonChai);

describe('UNIT: Queue Service', () => {
  let executionWorker: ExecutionWorker;
  let queueMemoryStore: QueueMemoryStore;
  let messageRepository: IMessageRepository;
  let deploymentRepository: IRepository<Deployment>;
  let messageExecutor: MessageExecutor;
  let deploymentExecutor: DeploymentExecutor;
  const wait = sinon.fake.returns({gasUsed: '1'});
  const wallet: any = {
    sendTransaction: sinon.fake.returns({
      hash: TEST_TRANSACTION_HASH,
      wait,
      gasPrice: constants.One,
    }),
  };
  const walletService: WalletDeploymentService = {

  } as WalletDeploymentService;
  const messageValidator: any = {
    validate: sinon.fake.returns(true),
  };
  const onTransactionMined = sinon.spy();
  const minedTransactionHandler: any = {
    handle: onTransactionMined,
  };
  const validator: any = {
    validate: async () => Promise.resolve(),
  };
  let signedMessage: SignedMessage;
  let messageHash: string;

  beforeEach(async () => {
    queueMemoryStore = new QueueMemoryStore();
    messageRepository = new MessageMemoryRepository();
    deploymentRepository = new MemoryRepository<Deployment>();
    messageExecutor = new MessageExecutor(wallet, messageValidator, messageRepository, minedTransactionHandler, {messageToTransaction: messageToTransaction} as any, validator, validator);
    deploymentExecutor = new DeploymentExecutor(deploymentRepository, walletService);
    executionWorker = new ExecutionWorker([messageExecutor, deploymentExecutor], queueMemoryStore);
    signedMessage = getTestSignedMessage();
    messageHash = calculateMessageHash(signedMessage);
    await messageRepository.add(
      messageHash,
      createTestMessageItem(signedMessage),
    );
    sinon.resetHistory();
  });

  it('signedMessage round trip', async () => {
    const executeSpy = sinon.spy(messageExecutor, 'execute');
    executionWorker.start();
    await queueMemoryStore.addMessage(messageHash);
    await waitExpect(() => expect(executeSpy).to.be.calledOnce);
    await waitExpect(() => expect(wait).to.be.calledOnce);
    expect(onTransactionMined).to.be.calledImmediatelyAfter(wait);
    expect(wait).to.be.calledOnce;
    expect(onTransactionMined).to.be.calledOnce;
  });

  it('should execute pending signedMessage after start', async () => {
    const executeSpy = sinon.spy(messageExecutor, 'execute');
    await queueMemoryStore.addMessage(messageHash);
    executionWorker.start();
    await waitExpect(() => expect(executeSpy).to.be.calledOnce);
    expect(wait).to.be.calledAfter(executeSpy);
  });

  it('should throw error when hash is null', async () => {
    messageExecutor.execute = sinon.fake.returns(null);
    executionWorker = new ExecutionWorker([messageExecutor, deploymentExecutor], queueMemoryStore);
    executionWorker.start();
    const markAsErrorSpy = sinon.spy(messageRepository.markAsError);
    messageRepository.markAsError = markAsErrorSpy;
    queueMemoryStore.remove = sinon.spy(queueMemoryStore.remove);
    await messageRepository.add(messageHash, createTestMessageItem(signedMessage));
    await queueMemoryStore.addMessage(messageHash);
    await waitExpect(() => expect(messageRepository.markAsError).calledWith(messageHash, 'TypeError: Cannot read property \'hash\' of null'));
    expect(queueMemoryStore.remove).to.be.calledOnce;
    expect(queueMemoryStore.remove).to.be.calledAfter(markAsErrorSpy);
    expect(onTransactionMined).to.be.not.called;
  });

  it('should not execute if the executor cannot execute, but remove from the queue', async () => {
    messageExecutor.canExecute = sinon.fake.returns(false);
    const executeSpy = sinon.spy(messageExecutor, 'execute');
    executionWorker = new ExecutionWorker([messageExecutor, deploymentExecutor], queueMemoryStore);
    executionWorker.start();
    queueMemoryStore.remove = sinon.spy(queueMemoryStore.remove);
    await messageRepository.add(messageHash, createTestMessageItem(signedMessage));
    await queueMemoryStore.addMessage(messageHash);

    await waitExpect(() => expect(queueMemoryStore.remove).to.be.calledOnce, 3000);
    expect(messageExecutor.canExecute).to.be.calledOnce;
    expect(executeSpy).to.not.be.called;
  });

  afterEach(async () => {
    await executionWorker.stopLater();
  });
});
