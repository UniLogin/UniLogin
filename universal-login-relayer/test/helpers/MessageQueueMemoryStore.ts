import {SignedMessage} from '@universal-login/commons';
import {IMessageQueueStore, MessageEntity} from '../../lib/services/messages/IMessageQueueStore';

export default class MessageQueueMemoryStore implements IMessageQueueStore {
  private counter: number;
  public messageEntries: MessageEntity[];

  constructor() {
    this.counter = 0;
    this.messageEntries = [];
  }

  async add (signedMessage: SignedMessage) {
    this.counter++;
    this.messageEntries.push({
      message: signedMessage,
      id: this.counter.toString(),
      hash: 'hash',
      error: undefined
    });
    return this.counter.toString();
  }

  async getNext () {
    return this.messageEntries[0];
  }

  async onSuccessRemove (id: string, hash: string) {
    this.messageEntries.pop();
  }

  async onErrorRemove (id: string, error: string) {
    this.messageEntries.pop();
  }
}
