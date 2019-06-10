import {providers} from 'ethers';
import {sleep, onCritical, SignedMessage, calculateMessageHash} from '@universal-login/commons';
import IMessageQueueStore from './IMessageQueueStore';
import MessageExecutor from './MessageExecutor';
import IPendingMessagesStore from './IPendingMessagesStore';
import { bignumberifySignedMessageFields } from '../../utils/changingMessageFields';

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

  async execute(signedMessage: SignedMessage, id: string) {
    try {
      const {hash} = await this.messageExecutor.executeAndWait(signedMessage);
      const messageEntity = await this.queueMessageStore.get(id);
      const messageHash = await calculateMessageHash(bignumberifySignedMessageFields(messageEntity!.message));
      await this.pendingMessagesStore.setTransactionHash(messageHash, hash!);
      await this.queueMessageStore.markAsSuccess(id, hash!);
    } catch (error) {
      await this.queueMessageStore.markAsError(id, `${error.name}: ${error.message}`);
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

  async getStatus(id: string) {
    return this.queueMessageStore.get(id);
  }
}

export default MessageQueueService;
