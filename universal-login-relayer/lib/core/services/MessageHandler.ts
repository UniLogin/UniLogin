import {Wallet} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import PendingMessages from './messages/PendingMessages';
import IMessageRepository from '../models/messages/IMessagesRepository';
import {IExecutionQueue} from '../models/execution/IExecutionQueue';
import {MessageStatusService} from './messages/MessageStatusService';
import {GasValidator} from './validators/GasValidator';

class MessageHandler {
  private pendingMessages: PendingMessages;

  constructor(
    wallet: Wallet,
    messageRepository: IMessageRepository,
    statusService: MessageStatusService,
    private gasValidator: GasValidator,
    private executionQueue: IExecutionQueue,
  ) {
    this.pendingMessages = new PendingMessages(wallet, messageRepository, this.executionQueue, statusService);
  }

  async handleMessage(message: SignedMessage) {
    await this.gasValidator.validate(message);
    return this.pendingMessages.add(message);
  }

  async getStatus(messageHash: string) {
    if (!await this.pendingMessages.isPresent(messageHash)) {
      return null;
    }
    return this.pendingMessages.getStatus(messageHash);
  }
}

export default MessageHandler;
