import {utils, Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {Message, defaultDeployOptions} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall, getRequiredSignatures} from '../../utils/utils';
import AuthorisationService from '../authorisationService';
import TransactionQueueService from './TransactionQueueService';
import {NotEnoughGas, NotEnoughTokens} from '../../utils/errors';
import PendingExecutions from './PendingExecutions';

class TransactionService {
  protected pendingExecutions: PendingExecutions;

  constructor(private wallet: Wallet, private authorisationService: AuthorisationService, private hooks: EventEmitter, private provider: providers.Provider, private transactionQueue: TransactionQueueService) {
    this.pendingExecutions = new PendingExecutions(wallet);
  }

  start() {
    this.transactionQueue.start();
  }

  async executeSigned(message: Message) {
    const requiredSignatures = await getRequiredSignatures(message.from, this.wallet);
    if (requiredSignatures > 1) {
      const hash = await this.pendingExecutions.add(message);
      const numberOfSignatures = (await this.pendingExecutions.getStatus(hash)).collectedSignatures.length;
      if (await this.pendingExecutions.isEnoughSignatures(hash) && numberOfSignatures !== 1) {
        return this.executePending(hash, message);
      }
      return JSON.stringify(this.pendingExecutions.getStatus(hash));
    } else {
      return this.execute(message);
    }
  }

  private async executePending(hash: string, message: Message) {
    const finalMessage = this.pendingExecutions.getMessageWithSignatures(message, hash);
    const transaction: any = await this.execute(finalMessage);
    await this.pendingExecutions.get(hash).confirmExecution(transaction.hash);
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
      throw new NotEnoughGas();
    }
    throw new NotEnoughTokens();
  }

  async getStatus(hash: string) {
    return this.pendingExecutions.getStatus(hash);
  }

  stop() {
    this.transactionQueue.stop();
  }
}

export default TransactionService;
