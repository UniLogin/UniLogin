import {SignedMessage} from '@universal-login/commons';

export interface IMessageQueueStore {
  add: (message: SignedMessage) => Promise<string>;
  get: (id: string) => Promise<MessageEntity | undefined>;
  getNext: () => Promise<MessageEntity | undefined>;
  onSuccessRemove: (id: string, hash: string) => Promise<void>;
  onErrorRemove: (id: string, error: string) => Promise<void>;
}

export interface MessageEntity {
  id: string;
  hash: string | undefined;
  error: string | undefined;
  message: SignedMessage;
}

export default IMessageQueueStore;
