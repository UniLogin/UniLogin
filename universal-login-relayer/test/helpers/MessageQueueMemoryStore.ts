import {SignedMessage, calculateMessageHash} from '@universal-login/commons';
import {IMessageQueueStore} from '../../lib/core/services/messages/IMessageQueueStore';
import {MessageEntity} from '../../lib/core/models/messages/MessageEntity';

export default class MessageQueueMemoryStore implements IMessageQueueStore {
  public messageEntries: MessageEntity[];

  constructor() {
    this.messageEntries = [];
  }

  async add(signedMessage: SignedMessage) {
    const messageHash = calculateMessageHash(signedMessage);
    this.messageEntries.push({
      messageHash
    });
    return messageHash;
  }

  async getNext() {
    return this.messageEntries[0];
  }

  async remove(messageHash: string) {
    this.messageEntries.splice(this.findIndex(messageHash), 1);
  }

  private findIndex(messageHash: string) {
    return this.messageEntries.findIndex((messageEntity: MessageEntity) => messageEntity.messageHash === messageHash);
  }
}
