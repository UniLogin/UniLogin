import {utils, Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {Message, defaultDeployOptions} from '@universal-login/commons';
import {isAddKeyCall, getKeyFromData, isAddKeysCall, getRequiredSignatures} from '../../utils/utils';
import AuthorisationService from '../authorisationService';
import TransactionQueueService from './TransactionQueueService';
import PendingExecutions from './PendingExecutions';
import {ensureEnoughToken, ensureEnoughGas} from './validations';
import {encodeDataForExecuteSigned, decodeDataForExecuteSigned} from './serialisation';

class TransactionService {

  constructor(private wallet: Wallet, private authorisationService: AuthorisationService, private hooks: EventEmitter, private provider: providers.Provider, private transactionQueue: TransactionQueueService, private pendingExecutions: PendingExecutions) {
  }

  start() {
    this.transactionQueue.setOnTransactionSent(this.onTransactionSent);
    this.transactionQueue.start();
  }

  async onTransactionSent(sentTransaction: providers.TransactionResponse) {
    const {data} = sentTransaction;
    const message = decodeDataForExecuteSigned(data!);
    if (message.to === sentTransaction.to) {
      if (isAddKeyCall(message.data as string)) {
        await this.removeReqFromAuthService({...message, from: sentTransaction.to!});
        this.hooks.emit('added', sentTransaction);
      } else if (isAddKeysCall(message.data as string)) {
        this.hooks.emit('keysAdded', sentTransaction);
      }
    }
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
    await this.pendingExecutions.remove(hash);
    return transaction;
  }

  async execute(message: Message) {
    await ensureEnoughToken(this.provider, message);
    const transaction: providers.TransactionRequest = {
      ...defaultDeployOptions,
      value: utils.parseEther('0'),
      to: message.from,
      data: encodeDataForExecuteSigned(message)
    };
    await ensureEnoughGas(this.provider, this.wallet.address, transaction, message);
    const sentTransaction = await this.wallet.sendTransaction(transaction);
    await this.onTransactionSent(sentTransaction);
    return sentTransaction;
  }

  private async removeReqFromAuthService(message: Message) {
    const key = getKeyFromData(message.data as string);
    await this.authorisationService.removeRequest(message.from, key);
  }

  async getStatus(hash: string) {
    if (this.pendingExecutions.isPresent(hash)){
      return this.pendingExecutions.getStatus(hash);
    } else {
      return null;
    }
  }

  stop() {
    this.transactionQueue.stop();
    this.transactionQueue.setOnTransactionSent(undefined);
  }

  async stopLater() {
    this.transactionQueue.stopLater();
    this.transactionQueue.setOnTransactionSent(undefined);
  }
}

export default TransactionService;
