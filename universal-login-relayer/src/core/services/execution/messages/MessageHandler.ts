import {SignedMessage} from '@unilogin/commons';
import PendingMessages from './PendingMessages';
import {MessageHandlerValidator} from '../../validators/MessageHandlerValidator';

class MessageHandler {
  constructor(
    private pendingMessages: PendingMessages,
    private validator: MessageHandlerValidator,
  ) {

  }

  async handle(message: SignedMessage, refundPayerId?: string) {
    await this.validator.validate(message);
    return this.pendingMessages.add(message, refundPayerId);
  }

  async getStatus(messageHash: string) {
    if (!await this.pendingMessages.isPresent(messageHash)) {
      return null;
    }
    return this.pendingMessages.getStatus(messageHash);
  }
}

export default MessageHandler;
