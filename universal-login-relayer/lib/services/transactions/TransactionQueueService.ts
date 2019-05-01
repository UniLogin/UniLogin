import {Wallet, utils, providers} from 'ethers';
import {sleep, onCritical} from '@universal-login/commons';
import TransactionQueueStore from './TransactionQueueStore';

type QueueState = 'running' | 'stopped' | 'stopping';

class QueuedTransactionService {
  private state: QueueState;

  constructor(private wallet: Wallet, private provider: providers.Provider, private queueTransactionStore: TransactionQueueStore, private tick: number = 100){
    this.state = 'stopped';
  }

  async add(transaction: Partial<utils.Transaction>) {
    return this.queueTransactionStore.add(transaction);
  }

  async execute(message: Partial<utils.Transaction>, id: string) {
    try {
      const {hash} = await this.wallet.sendTransaction(message);
      await this.provider.waitForTransaction(hash!);
      await this.queueTransactionStore.onSuccessRemove(id, hash!);
    } catch (error) {
      await this.queueTransactionStore.onErrorRemove(id, `${error.name}: ${error.message}`);
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
