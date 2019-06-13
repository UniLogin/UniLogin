import {Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {SignedMessage, ContractWhiteList} from '@universal-login/commons';
import {isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import AuthorisationService from './authorisationService';
import MessageQueueService from './messages/MessageQueueService';
import PendingMessages from './messages/PendingMessages';
import {decodeDataForExecuteSigned} from './messages/serialisation';
import MessageExecutor from './messages/MessageExecutor';
import MessageValidator from './messages/MessageValidator';
import IPendingMessagesStore from './messages/IPendingMessagesStore';
import IMessageQueueStore from './messages/IMessageQueueStore';

class MessageHandler {
  private pendingMessages: PendingMessages;
  private messageQueue: MessageQueueService;
  private executor: MessageExecutor;
  private validator: MessageValidator;

  constructor(private wallet: Wallet, private authorisationService: AuthorisationService, private hooks: EventEmitter, pendingMessagesStore: IPendingMessagesStore, messageQueueStore: IMessageQueueStore, contractWhiteList: ContractWhiteList) {
    this.validator = new MessageValidator(this.wallet, contractWhiteList);
    this.executor = new MessageExecutor(
      this.wallet,
      this.onTransactionSent.bind(this),
      this.validator
      );
    this.messageQueue = new MessageQueueService(this.executor, messageQueueStore, pendingMessagesStore);
    this.pendingMessages = new PendingMessages(this.wallet, pendingMessagesStore, this.messageQueue);
  }

  start() {
    this.messageQueue.start();
  }

  async onTransactionSent(sentTransaction: providers.TransactionResponse) {
    const {data, to} = sentTransaction;
    const message = decodeDataForExecuteSigned(data);
    if (message.to === to) {
      if (isAddKeyCall(message.data as string)) {
        await this.removeReqFromAuthService({...message, from: to});
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

  async getStatus(messageHash: string) {
    if (!await this.pendingMessages.isPresent(messageHash)) {
      return null;
    }
    const pendingStatus = await this.pendingMessages.getStatus(messageHash);
    const queueStatus = await this.messageQueue.getStatus(messageHash) || {};
    return {
      ...pendingStatus,
      ...queueStatus
    };
  }

  stop() {
    this.messageQueue.stop();
  }

  async stopLater() {
    return this.messageQueue.stopLater();
  }
}

export default MessageHandler;
