import {Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {SignedMessage} from '@universal-login/commons';
import {isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import QueueService from './messages/QueueService';
import PendingMessages from './messages/PendingMessages';
import {decodeDataForExecuteSigned} from '../utils/messages/serialisation';
import MessageExecutor from '../../integration/ethereum/MessageExecutor';
import MessageValidator from './messages/MessageValidator';
import IMessageRepository from './messages/IMessagesRepository';
import IQueueStore from './messages/IQueueStore';
import {MessageStatusService} from './messages/MessageStatusService';

class MessageHandler {
  private pendingMessages: PendingMessages;
  private queueService: QueueService;
  private executor: MessageExecutor;

  constructor(
    wallet: Wallet,
    private authorisationStore: AuthorisationStore,
    private hooks: EventEmitter,
    messageRepository: IMessageRepository,
    queueStore: IQueueStore,
    messageValidator: MessageValidator,
    statusService: MessageStatusService
  ) {
    this.executor = new MessageExecutor(
      wallet,
      this.onTransactionSent.bind(this),
      messageValidator
      );
    this.queueService = new QueueService(this.executor, queueStore, messageRepository);
    this.pendingMessages = new PendingMessages(wallet, messageRepository, this.queueService, statusService);
  }

  start() {
    this.queueService.start();
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
    return this.authorisationStore.removeRequest(message.from, key);
  }

  async getStatus(messageHash: string) {
    if (!await this.pendingMessages.isPresent(messageHash)) {
      return null;
    }
    return this.pendingMessages.getStatus(messageHash);
  }

  stop() {
    this.queueService.stop();
  }

  async stopLater() {
    return this.queueService.stopLater();
  }
}

export default MessageHandler;
