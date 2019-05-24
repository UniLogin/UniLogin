import {Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {SignedMessage, MessageStatus} from '@universal-login/commons';
import {isAddKeyCall, getKeyFromData, isAddKeysCall, getRequiredSignatures} from '../utils/utils';
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

  async executeSigned(message: SignedMessage) {
    const requiredSignatures = await getRequiredSignatures(message.from, this.wallet);
    if (requiredSignatures > 1) {
      const hash = await this.pendingMessages.add(message);
      const messageStatus = (await this.pendingMessages.getStatus(hash)) as MessageStatus;
      const numberOfSignatures = messageStatus.totalCollected;
      if (await this.pendingMessages.isEnoughSignatures(hash) && numberOfSignatures !== 1) {
        return this.executePending(hash, message);
      }
      return JSON.stringify(this.pendingMessages.getStatus(hash));
    } else {
      return this.executor.execute(message);
    }
  }

  private async executePending(hash: string, message: SignedMessage) {
    const finalMessage = this.pendingMessages.getMessageWithSignatures(message, hash);
    await this.pendingMessages.ensureCorrectExecution(hash);
    const transaction: providers.TransactionRequest = await this.executor.execute(finalMessage);
    await this.pendingMessages.remove(hash);
    return transaction;
  }

  private async removeReqFromAuthService(message: SignedMessage) {
    const key = getKeyFromData(message.data as string);
    await this.authorisationService.removeRequest(message.from, key);
  }

  async getStatus(hash: string) {
    if (this.pendingMessages.isPresent(hash)){
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
