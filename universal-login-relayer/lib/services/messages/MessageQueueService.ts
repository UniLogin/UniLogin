import {Wallet, providers} from 'ethers';
import {sleep, onCritical, SignedMessage} from '@universal-login/commons';
import IMessageQueueStore from './IMessageQueueStore';
import {messageToTransaction} from '../../utils/utils';

type QueueState = 'running' | 'stopped' | 'stopping';

export type OnTransactionSent = (transaction: providers.TransactionResponse) => Promise<void>;

class QueuedMessageService {
  private state: QueueState;
  private onTransactionSent?: OnTransactionSent;

  constructor(private wallet: Wallet, private provider: providers.Provider, private queueMessageStore: IMessageQueueStore, private tick: number = 100){
    this.state = 'stopped';
  }

  async add(signedMessage: SignedMessage) {
    return this.queueMessageStore.add(signedMessage);
  }

  async execute(signedMessage: SignedMessage, id: string) {
    try {
      const transaction: providers.TransactionRequest = messageToTransaction(signedMessage);
      const sentTransaction = await this.wallet.sendTransaction(transaction);
      await this.provider.waitForTransaction(sentTransaction.hash!);
      await this.onTransactionSent!(sentTransaction);
      await this.queueMessageStore.onSuccessRemove(id, sentTransaction.hash!);
    } catch (error) {
      await this.queueMessageStore.onErrorRemove(id, `${error.name}: ${error.message}`);
    }
  }

  setOnTransactionSent(callback?: OnTransactionSent) {
    this.onTransactionSent = callback;
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

export default QueuedMessageService;
