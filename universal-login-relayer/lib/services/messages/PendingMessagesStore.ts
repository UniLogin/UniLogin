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

  get(messageHash: string): PendingMessage {
    return this.messages[messageHash];
  }

  remove(messageHash: string): PendingMessage {
    const pendingExecution = this.messages[messageHash];
    delete this.messages[messageHash];
    return pendingExecution;
  }

  containSignature(messageHash: string, signature: string) : boolean {
    return this.messages[messageHash] ? 
      this.messages[messageHash]
        .collectedSignatures.filter((collectedSignature) => collectedSignature.signature === signature)
        .length > 0 :
      false;
  }
}
