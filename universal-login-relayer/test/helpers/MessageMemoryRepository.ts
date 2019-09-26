import {SignedMessage, stringifySignedMessageFields, bignumberifySignedMessageFields, ensureNotNull, MessageState} from '@universal-login/commons';
import {getKeyFromHashAndSignature} from '../../lib/core/utils/encodeData';
import {InvalidMessage, MessageNotFound} from '../../lib/core/utils/errors';
import MessageItem from '../../lib/core/models/messages/MessageItem';
import IMessageRepository from '../../lib/core/services/messages/IMessagesRepository';
import {ensureProperTransactionHash} from '../../lib/core/utils/validations';
import MemoryRepository from './MemoryRepository';

export default class MessageMemoryRepository extends MemoryRepository<MessageItem> implements IMessageRepository {
  // Override
  async add(messageHash: string, messageItem: MessageItem) {
    ensureNotNull(messageItem.message, MessageNotFound, messageHash);
    messageItem.message = bignumberifySignedMessageFields(stringifySignedMessageFields(messageItem.message));
    await super.add(messageHash, messageItem);
  }

  throwIfInvalidMessage(messageHash: string) {
    if (!this.items[messageHash]) {
      throw new InvalidMessage(messageHash);
    }
  }

  // Override
  async get(messageHash: string): Promise<MessageItem> {
    this.throwIfInvalidMessage(messageHash);
    return super.get(messageHash);
  }

  async remove(messageHash: string): Promise<MessageItem> {
    const messageItem = this.items[messageHash];
    delete this.items[messageHash];
    return messageItem;
  }

  async containSignature(messageHash: string, signature: string) : Promise<boolean> {
    const message = this.items[messageHash];
    return !!message && message
      .collectedSignatureKeyPairs
      .filter((collectedSignature) => collectedSignature.signature === signature)
      .length > 0;
  }

  async getCollectedSignatureKeyPairs(messageHash: string) {
    return this.items[messageHash].collectedSignatureKeyPairs;
  }

  async addSignedMessage(messageHash: string, signedMessage: SignedMessage) {
    this.items[messageHash].message = bignumberifySignedMessageFields(stringifySignedMessageFields(signedMessage));
  }

  async getMessage(messageHash: string) {
    const message = (await this.get(messageHash)).message;
    ensureNotNull(message, MessageNotFound, messageHash);
    return message as SignedMessage;
  }

  async addSignature(messageHash: string, signature: string) {
    const key = getKeyFromHashAndSignature(messageHash, signature);
    this.items[messageHash].collectedSignatureKeyPairs.push({signature, key});
  }

  async markAsPending(messageHash: string, transactionHash: string) {
    ensureProperTransactionHash(transactionHash);
    this.items[messageHash].transactionHash = transactionHash;
    this.items[messageHash].state = 'Pending';
  }

  async markAsError(messageHash: string, error: string) {
    this.items[messageHash].error = error;
    this.items[messageHash].state = 'Error';
  }

  async setMessageState(messageHash: string, state: MessageState) {
    this.items[messageHash].state = state;
  }
}
