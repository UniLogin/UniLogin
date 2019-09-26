import {providers} from 'ethers';
import {sleep, onCritical, SignedMessage, ensureNotNull} from '@universal-login/commons';
import {IExecutionQueue} from './IExecutionQueue';
import MessageExecutor from '../../../integration/ethereum/MessageExecutor';
import IMessageRepository from './IMessagesRepository';
import {TransactionHashNotFound} from '../../utils/errors';

type QueueState = 'running' | 'stopped' | 'stopping';

export type OnTransactionMined = (transaction: providers.TransactionResponse) => Promise<void>;

class QueueService {
  private state: QueueState;

  constructor(
    private messageExecutor: MessageExecutor,
    private messageQueue: IExecutionQueue,
    private messageRepository: IMessageRepository,
    private onTransactionMined: OnTransactionMined,
    private tick: number = 100
  ) {
    this.state = 'stopped';
  }

  async add(signedMessage: SignedMessage) {
    const messageHash = await this.messageQueue.addMessage(signedMessage);
    await this.messageRepository.setMessageState(messageHash, 'Queued');
    return messageHash;
  }

  async execute(messageHash: string) {
    try {
      const signedMessage = await this.messageRepository.getMessage(messageHash);
      const transactionResponse = await this.messageExecutor.execute(signedMessage);
      const {hash, wait} = transactionResponse;
      ensureNotNull(hash, TransactionHashNotFound);
      await this.messageRepository.markAsPending(messageHash, hash!);
      await wait();
      await this.onTransactionMined(transactionResponse);
      await this.messageRepository.setMessageState(messageHash, 'Success');
    } catch (error) {
      const errorMessage = `${error.name}: ${error.message}`;
      await this.messageRepository.markAsError(messageHash, errorMessage);
    }
    await this.messageQueue.remove(messageHash);
  }

  start() {
    if (this.state !== 'running') {
      this.state = 'running';
      this.loop().catch(onCritical);
    }
  }

  async loop() {
    do {
      const nextMessage = await this.messageQueue.getNext();
      if (nextMessage && this.messageExecutor.canExecute(nextMessage)){
        await this.execute(nextMessage.hash);
      } else if (nextMessage) {
        await this.messageQueue.remove(nextMessage.hash);
      } else {
        if (this.state === 'stopping'){
          this.state = 'stopped';
        } else {
          await sleep(this.tick);
        }
      }
    } while (this.state !== 'stopped');
  }

  async stop() {
    this.state = 'stopped';
  }

  async stopLater() {
    this.state = 'stopping';
    while (!this.isStopped()) {
      await sleep(this.tick);
    }
  }

  private isStopped() {
    return this.state === 'stopped';
  }
}

export default QueueService;
