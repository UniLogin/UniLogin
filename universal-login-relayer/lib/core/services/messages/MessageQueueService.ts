import {providers} from 'ethers';
import {sleep, onCritical, SignedMessage} from '@universal-login/commons';
import IMessageQueueStore from './IMessageQueueStore';
import MessageExecutor from '../../../integration/ethereum/MessageExecutor';
import IPendingMessagesStore from './IPendingMessagesStore';

type QueueState = 'running' | 'stopped' | 'stopping';

export type OnTransactionSent = (transaction: providers.TransactionResponse) => Promise<void>;

class MessageQueueService {
  private state: QueueState;

  constructor(private messageExecutor: MessageExecutor, private queueMessageStore: IMessageQueueStore, private pendingMessagesStore: IPendingMessagesStore, private tick: number = 100){
    this.state = 'stopped';
  }

  async add(signedMessage: SignedMessage) {
    return this.queueMessageStore.add(signedMessage);
  }

  async execute(messageHash: string) {
    try {
      const signedMessage = await this.pendingMessagesStore.getSignedMessage(messageHash);
      const {hash} = await this.messageExecutor.executeAndWait(signedMessage);
      await this.pendingMessagesStore.markAsSuccess(messageHash, hash!);
      await this.queueMessageStore.markAsSuccess(messageHash, hash!);
    } catch (error) {
      const errorMessage = `${error.name}: ${error.message}`;
      await this.pendingMessagesStore.markAsError(messageHash, errorMessage);
      await this.queueMessageStore.markAsError(messageHash, errorMessage);
    }
  }

  start() {
    if (this.state !== 'running') {
      this.state = 'running';
      this.loop().catch(onCritical);
    }
  }

  async loop() {
    do {
      const nextMessage = await this.queueMessageStore.getNext();
      if (nextMessage){
        await this.execute(nextMessage.messageHash);
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

  async getStatus(messageHash: string) {
    return this.queueMessageStore.getStatus(messageHash);
  }
}

export default MessageQueueService;
