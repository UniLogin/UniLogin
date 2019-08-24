import {Wallet, providers} from 'ethers';
import {EventEmitter} from 'fbemitter';
import {SignedMessage} from '@universal-login/commons';
import {isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import QueueService from './messages/QueueService';
import PendingMessages from './messages/PendingMessages';
import {decodeDataForExecuteSigned} from '../utils/messages/serialisation';
import MessageExecutor from '../../integration/ethereum/MessageExecutor';
import IMessageRepository from './messages/IMessagesRepository';
import IQueueStore from './messages/IQueueStore';
import {MessageStatusService} from './messages/MessageStatusService';

class MessageHandler {
  private pendingMessages: PendingMessages;
  private queueService: QueueService;

  constructor(
    wallet: Wallet,
    private authorisationStore: AuthorisationStore,
    private hooks: EventEmitter,
    messageRepository: IMessageRepository,
    queueStore: IQueueStore,
    messageExecutor: MessageExecutor,
    statusService: MessageStatusService
  ) {
    this.queueService = new QueueService(messageExecutor, queueStore, messageRepository, this.onTransactionSent.bind(this));
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
        this.hooks.emit('added', {transaction: sentTransaction, contractAddress: to});
      } else if (isAddKeysCall(message.data as string)) {
        this.hooks.emit('keysAdded', {transaction: sentTransaction, contractAddress: to});
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

  async stop() {
    await this.queueService.stop();
  }

  async stopLater() {
    return this.queueService.stopLater();
  }
}

export default MessageHandler;
