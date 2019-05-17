import {Wallet, utils, providers} from 'ethers';
import {sleep, onCritical} from '@universal-login/commons';
import ITransactionQueueStore from './ITransactionQueueStore';

type QueueState = 'running' | 'stopped' | 'stopping';

type OnTransactionSent = (transaction: Partial<utils.Transaction>) => Promise<void>;
class QueuedTransactionService {
  private state: QueueState;
  private onTransactionSent?: OnTransactionSent;

  constructor(private wallet: Wallet, private provider: providers.Provider, private queueTransactionStore: ITransactionQueueStore, private tick: number = 100){
    this.state = 'stopped';
  }

  async add(transaction: Partial<utils.Transaction>) {
    return this.queueTransactionStore.add(transaction);
  }

  async execute(transaction: Partial<utils.Transaction>, id: string) {
    try {
      const sentTransaction = await this.wallet.sendTransaction(transaction);
      await this.provider.waitForTransaction(sentTransaction.hash!);
      await this.onTransactionSent!(sentTransaction);
      await this.queueTransactionStore.onSuccessRemove(id, sentTransaction.hash!);
    } catch (error) {
      await this.queueTransactionStore.onErrorRemove(id, `${error.name}: ${error.message}`);
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
      const nextTransaction = await this.queueTransactionStore.getNext();
      if (nextTransaction){
        await this.execute(nextTransaction.message, nextTransaction.id);
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

export default QueuedTransactionService;
