import {SignedMessage, stringifySignedMessageFields, bignumberifySignedMessageFields, ensureNotNull} from '@universal-login/commons';
import {getKeyFromHashAndSignature} from '../../lib/core/utils/utils';
import {InvalidMessage, MessageNotFound} from '../../lib/core/utils/errors';
import MessageItem from '../../lib/core/models/messages/MessageItem';
import IMessageRepository from '../../lib/core/services/messages/IMessagesRepository';
import {ensureProperTransactionHash} from '../../lib/core/utils/validations';

export default class MessageMemoryRepository implements IMessageRepository {
  public messageItems: Record<string, MessageItem>;

  constructor () {
    this.messageItems = {};
  }

  async add(messageHash: string, messageItem: MessageItem) {
    ensureNotNull(messageItem.message, MessageNotFound, messageHash);
    messageItem.message = bignumberifySignedMessageFields(stringifySignedMessageFields(messageItem.message));
    this.messageItems[messageHash] = messageItem;
  }

  async isPresent(messageHash: string) {
    return messageHash in this.messageItems;
  }

  throwIfInvalidMessage(messageHash: string) {
    if (!this.messageItems[messageHash]) {
      throw new InvalidMessage(messageHash);
    }
  }

  async get(messageHash: string): Promise<MessageItem> {
    this.throwIfInvalidMessage(messageHash);
    return this.messageItems[messageHash];
  }

  async remove(messageHash: string): Promise<MessageItem> {
    const messageItem = this.messageItems[messageHash];
    delete this.messageItems[messageHash];
    return messageItem;
  }

  async containSignature(messageHash: string, signature: string) : Promise<boolean> {
    const message = this.messageItems[messageHash];
    return !!message && message
      .collectedSignatureKeyPairs
      .filter((collectedSignature) => collectedSignature.signature === signature)
      .length > 0;
  }

  async getCollectedSignatureKeyPairs(messageHash: string) {
    return this.messageItems[messageHash].collectedSignatureKeyPairs;
  }

  async addSignedMessage(messageHash: string, signedMessage: SignedMessage) {
    this.messageItems[messageHash].message = bignumberifySignedMessageFields(stringifySignedMessageFields(signedMessage));
  }

  async getMessage(messageHash: string) {
    const message = (await this.get(messageHash)).message;
    ensureNotNull(message, MessageNotFound, messageHash);
    return message as SignedMessage;
  }

  async addSignature(messageHash: string, signature: string) {
    const key = getKeyFromHashAndSignature(messageHash, signature);
    this.messageItems[messageHash].collectedSignatureKeyPairs.push({signature, key});
  }

  async markAsSuccess(messageHash: string, transactionHash: string) {
    ensureProperTransactionHash(transactionHash);
    this.messageItems[messageHash].transactionHash = transactionHash;
  }

  async markAsError(messageHash: string, error: string) {
    this.messageItems[messageHash].error = error;
  }
}
