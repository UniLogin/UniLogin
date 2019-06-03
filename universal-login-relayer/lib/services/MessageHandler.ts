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
import IPendingMessagesStore from './messages/IPendingMessagesStore';

class MessageHandler {
  private pendingMessages: PendingMessages;
  private executor: MessageExecutor;
  private validator: MessageValidator;

  constructor(private wallet: Wallet, private authorisationService: AuthorisationService, private hooks: EventEmitter, private transactionQueue: TransactionQueueService, private pendingMessagesStore: IPendingMessagesStore) {
    this.validator = new MessageValidator(this.wallet);
    this.executor = new MessageExecutor(
      this.wallet,
      this.onTransactionSent.bind(this),
      this.validator
      );
    this.pendingMessages = new PendingMessages(this.wallet, this.pendingMessagesStore, this.doExecute.bind(this));
  }

  private doExecute(message: SignedMessage) {
    return this.executor.execute(message);
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
    return this.pendingMessages.add(message);
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
