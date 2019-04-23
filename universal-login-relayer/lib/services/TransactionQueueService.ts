import {Wallet, utils, providers} from 'ethers';
import {sleep} from '@universal-login/commons';
import TransactionQueueStore from './TransactionQueueStore';
import {throwError} from 'ethers/errors';

type QueueState = 'running' | 'stopped' | 'stopping';

class QueuedTransactionService {
  private state: QueueState;

  constructor(private wallet: Wallet, private provider: providers.Provider, private queueTransactionStore: TransactionQueueStore, private step: number = 1000){
    this.state = 'stopped';
  }

  async add(transaction: Partial<utils.Transaction>) {
    return this.queueTransactionStore.add(transaction);
  }

  async execute(message: Partial<utils.Transaction>, id: string) {
    try {
      const {hash} = await this.wallet.sendTransaction(message);
      await this.provider.waitForTransaction(hash!);
      await this.queueTransactionStore.remove(id, {hash});
    } catch (error) {
      await this.queueTransactionStore.remove(id, {error: `${error.name}:${error.message}`});
    }
  }

  start() {
    if (this.state !== 'running') {
      this.state = 'running';
      this.loop().then(
        () => {},
        () => throwError('Loop Error', 'Loop Error', {state: this.state})
        );
    }
  }

  async loop() {
    while (this.state !== 'stopped') {
      const nextTransaction = await this.queueTransactionStore.getNext();
      if (nextTransaction){
        await this.execute(nextTransaction.message, nextTransaction.id);
      } else {
        await sleep(this.step);
      }
      if (this.state === 'stopping') {
        this.state = 'stopped';
      }
    }
  }

  async stop() {
    this.state = 'stopping';
  }

}

export default QueuedTransactionService;
