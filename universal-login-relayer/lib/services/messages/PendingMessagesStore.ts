import {MessageStatus} from '@universal-login/commons';
import {getKeyFromHashAndSignature} from '../../utils/utils';
import {InvalidExecution} from '../../utils/errors';
import PendingMessage from './PendingMessage';
import IPendingMessagesStore from './IPendingMessagesStore';

export default class PendingMessagesStore implements IPendingMessagesStore {
  public messages: Record<string, PendingMessage>;

  constructor () {
    this.messages = {};
  }

  add(messageHash: string, pendingMessage: PendingMessage) {
    this.messages[messageHash] = pendingMessage;
  }

  isPresent(messageHash: string) {
    return messageHash in this.messages;
  }

  throwIfInvalidMessage(messageHash: string) {
    if (!this.messages[messageHash]) {
      throw new InvalidExecution(messageHash);
    }
  }

  get(messageHash: string): PendingMessage {
    this.throwIfInvalidMessage(messageHash);
    return this.messages[messageHash];
  }

  remove(messageHash: string): PendingMessage {
    const pendingExecution = this.messages[messageHash];
    delete this.messages[messageHash];
    return pendingExecution;
  }

  containSignature(messageHash: string, signature: string) : boolean {
    const message = this.messages[messageHash];
    return !!message && message
      .collectedSignatures
      .filter((collectedSignature) => collectedSignature.signature === signature)
      .length > 0;
  }

  async getStatus(messageHash: string) : Promise<MessageStatus>  {
    this.throwIfInvalidMessage(messageHash);
    const message = this.messages[messageHash];
    const required = await message.walletContract.requiredSignatures();
    return {
      collectedSignatures: message.collectedSignatures.map((collected) => collected.signature),
      totalCollected: message.collectedSignatures.length,
      required,
      transactionHash: message.transactionHash
    };
  }

  getCollectedSignatures(messageHash: string) {
    return this.messages[messageHash].collectedSignatures;
  }

  addSignature(messageHash: string, signature: string) {
    const key = getKeyFromHashAndSignature(messageHash, signature);
    this.messages[messageHash].collectedSignatures.push({signature, key});
  }

  updateTransactionHash(messageHash: string, transactionHash: string) {
    this.messages[messageHash].transactionHash = transactionHash;
  }
}
