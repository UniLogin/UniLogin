import {utils, Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {Message, defaultDeployOptions} from '@universal-login/commons';
import {calculateMessageHash} from '@universal-login/contracts';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall, getRequiredSignatures} from '../../utils/utils';
import AuthorisationService from '../authorisationService';
import TransactionQueueService from './TransactionQueueService';
import PendingExecutionStore from './PendingExecutionStore';

class TransactionService {
  protected executionStore: PendingExecutionStore;

  constructor(private wallet: Wallet, private authorisationService: AuthorisationService, private hooks: EventEmitter, private provider: providers.Provider, private transactionQueue: TransactionQueueService) {
    this.executionStore = new PendingExecutionStore(wallet);
  }

  start() {
    this.transactionQueue.start();
  }

  async executeSigned(message: Message) {
    const requiredSignatures = await getRequiredSignatures(message.from, this.wallet);
    if (requiredSignatures > 1) {
      const hash = await calculateMessageHash(message);
      if (this.executionStore.isPresent(hash)) {
        await this.executionStore.add(message);
        if (this.executionStore.get(hash).canExecute()) {
          return this.executePending(hash, message);
        }
        return JSON.stringify(this.executionStore.getStatus(hash));
      } else {
        const hash = await this.executionStore.add(message);
        return JSON.stringify(await this.executionStore.getStatus(hash));
      }
    } else {
      return this.execute(message);
    }
  }

  private async executePending(hash: string, message: Message) {
    const finalMessage = {...message, signature: this.executionStore.get(hash).getConcatenatedSignatures()};
    const transaction: any = await this.execute(finalMessage);
    await this.executionStore.get(hash).confirmExecution(transaction.hash);
    return transaction;
  }

  async execute(message: Message) {
    if (await hasEnoughToken(message.gasToken, message.from, message.gasLimit, this.provider)) {
      const data = new utils.Interface(WalletContract.interface).functions.executeSigned.encode([message.to, message.value, message.data, message.nonce, message.gasPrice, message.gasToken, message.gasLimit, message.operationType, message.signature]);
      const transaction = {
        ...defaultDeployOptions,
        value: utils.parseEther('0'),
        to: message.from,
        data,
      };
      const estimateGas = await this.provider.estimateGas({...transaction, from: this.wallet.address});
      if (utils.bigNumberify(message.gasLimit as utils.BigNumberish).gte(estimateGas)) {
        if (message.to === message.from && isAddKeyCall(message.data as string)) {
          const key = getKeyFromData(message.data as string);
          await this.authorisationService.removeRequest(message.from, key);
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('added', sentTransaction);
          return sentTransaction;
        } else if (message.to === message.from && isAddKeysCall(message.data as string)) {
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('keysAdded', sentTransaction);
          return sentTransaction;
        }
        return this.wallet.sendTransaction(transaction);
      }
      throw new Error('Not enough gas');
    }
    throw new Error('Not enough tokens');
  }

  async getStatus(hash: string) {
    return this.executionStore.getStatus(hash);
  }

  stop() {
    this.transactionQueue.stop();
  }
}

export default TransactionService;
