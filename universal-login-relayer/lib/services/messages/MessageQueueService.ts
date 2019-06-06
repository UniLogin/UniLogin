import {providers} from 'ethers';
import {sleep, onCritical, SignedMessage} from '@universal-login/commons';
import IMessageQueueStore from './IMessageQueueStore';
import MessageExecutor from './MessageExecutor';

type QueueState = 'running' | 'stopped' | 'stopping';

export type OnTransactionSent = (transaction: providers.TransactionResponse) => Promise<void>;

class MessageQueueService {
  private state: QueueState;

  constructor(private messageExecutor: MessageExecutor, private queueMessageStore: IMessageQueueStore, private tick: number = 100){
    this.state = 'stopped';
  }

  async add(signedMessage: SignedMessage) {
    return this.queueMessageStore.add(signedMessage);
  }

  async execute(signedMessage: SignedMessage, id: string) {
    try {
      const sentTransaction = await this.messageExecutor.executeAndWait(signedMessage);
      await this.queueMessageStore.onSuccessRemove(id, sentTransaction.hash!);
    } catch (error) {
      await this.queueMessageStore.onErrorRemove(id, `${error.name}: ${error.message}`);
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
        await this.execute(nextMessage.message, nextMessage.id);
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

export default MessageQueueService;
