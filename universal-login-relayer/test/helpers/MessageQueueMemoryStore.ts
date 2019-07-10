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
      message: signedMessage,
      messageHash,
      transactionHash: undefined,
      error: undefined
    });
    return messageHash;
  }

  async getNext() {
    return this.messageEntries.filter((messageEntity: MessageEntity) => !messageEntity.error && !messageEntity.transactionHash)[0];
  }

  async get(messageHash: string) {
    return this.find(messageHash);
  }

  async getStatus(messageHash: string) {
    const {transactionHash, error} = this.find(messageHash)!;
    return {
      transactionHash,
      error
    };
  }

  async remove(messageHash: string) {
    this.messageEntries.splice(this.findIndex(messageHash), 1);
  }

  private find(messageHash: string) {
    return this.messageEntries.find((messageEntity: MessageEntity) => messageEntity.messageHash === messageHash);
  }

  private findIndex(messageHash: string) {
    return this.messageEntries.findIndex((messageEntity: MessageEntity) => messageEntity.messageHash === messageHash);
  }
}
