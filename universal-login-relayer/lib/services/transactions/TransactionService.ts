import {utils, Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {Message, defaultDeployOptions} from '@universal-login/commons';
import {isAddKeyCall, getKeyFromData, isAddKeysCall, getRequiredSignatures} from '../../utils/utils';
import AuthorisationService from '../authorisationService';
import TransactionQueueService from './TransactionQueueService';
import PendingExecutions from './PendingExecutions';
import {ensureEnoughToken, ensureEnoughGas} from './validation';
import {encodeDataForExecuteSigned} from '../../utils/transactions';

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
    await this.pendingExecutions.ensureCorrectExecution(hash);
    const transaction: any = await this.execute(finalMessage);
    await this.pendingExecutions.confirmExecution(hash, transaction.hash);
    return transaction;
  }

  async execute(message: Message) {
    await ensureEnoughToken(this.provider, message);
    const transaction = {
      ...defaultDeployOptions,
      value: utils.parseEther('0'),
      to: message.from,
      data: encodeDataForExecuteSigned(message)
    };
    await ensureEnoughGas(this.provider, this.wallet.address, transaction, message);
    if (message.to === message.from) {
      if (isAddKeyCall(message.data as string)) {
        return this.executeAddKey(message, transaction);
      } else if (isAddKeysCall(message.data as string)) {
        return this.executeAddKeys(transaction);
      }
    }
    return this.wallet.sendTransaction(transaction);
  }

  private async executeAddKeys(transaction: Partial<Message>) {
    const sentTransaction = await this.wallet.sendTransaction(transaction);
    this.hooks.emit('keysAdded', sentTransaction);
    return sentTransaction;
  }

  private async executeAddKey(message: Message, transaction: Partial<Message>) {
    await this.removeReqFromAuthService(message);
    const sentTransaction = await this.wallet.sendTransaction(transaction);
    this.hooks.emit('added', sentTransaction);
    return sentTransaction;
  }

  private async removeReqFromAuthService(message: Message) {
    const key = getKeyFromData(message.data as string);
    await this.authorisationService.removeRequest(message.from, key);
  }

  async getStatus(hash: string) {
    return this.pendingExecutions.getStatus(hash);
  }

  stop() {
    this.transactionQueue.stop();
  }
}

export default TransactionService;
