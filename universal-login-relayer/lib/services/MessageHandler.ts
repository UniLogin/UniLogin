import {Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {SignedMessage} from '@universal-login/commons';
import {isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import AuthorisationService from './authorisationService';
import TransactionQueueService from './transactions/TransactionQueueService';
import PendingMessages from './messages/PendingMessages';
import {decodeDataForExecuteSigned} from './transactions/serialisation';
import MessageExecutor from './messages/MessageExecutor';
import MessageValidator from './messages/MessageValidator';

class MessageHandler {
  private executor: MessageExecutor;
  private validator: MessageValidator;

  constructor(private wallet: Wallet, private authorisationService: AuthorisationService, private hooks: EventEmitter, private transactionQueue: TransactionQueueService, private pendingMessages: PendingMessages) {
    this.validator = new MessageValidator(this.wallet);
    this.executor = new MessageExecutor(
        this.wallet,
        this.onTransactionSent.bind(this),
        this.validator
      );
  }

  start() {
    this.transactionQueue.setOnTransactionSent(
      this.onTransactionSent.bind(this)
    );
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

  async handleMessage(message: SignedMessage) {
    const hash = await this.pendingMessages.add(message);
    if (await this.pendingMessages.isEnoughSignatures(hash)) {
      return this.executePending(hash, message);
    }
    return this.pendingMessages.getStatus(hash);
  }

  private async executePending(messageHash: string, message: SignedMessage) {
    const finalMessage = await this.pendingMessages.getMessageWithSignatures(message, messageHash);
    await this.pendingMessages.ensureCorrectExecution(messageHash);
    const transaction: providers.TransactionResponse = await this.executor.execute(finalMessage);
    await this.pendingMessages.confirmExecution(messageHash, transaction.hash!);
    return transaction;
  }

  private async removeReqFromAuthService(message: SignedMessage) {
    const key = getKeyFromData(message.data as string);
    return this.authorisationService.removeRequest(message.from, key);
  }

  async getStatus(hash: string) {
    if (await this.pendingMessages.isPresent(hash)){
      return this.pendingMessages.getStatus(hash);
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

export default MessageHandler;
