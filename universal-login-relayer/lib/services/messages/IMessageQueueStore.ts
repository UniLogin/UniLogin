import {SignedMessage, MessageQueueStatus} from '@universal-login/commons';

export interface IMessageQueueStore {
  add: (message: SignedMessage) => Promise<string>;
  get: (messageHash: string) => Promise<MessageEntity | undefined>;
  getStatus: (messageHash: string) => Promise<MessageQueueStatus | undefined>;
  getNext: () => Promise<MessageEntity | undefined>;
  markAsSuccess: (messageHash: string, transactionHash: string) => Promise<void>;
  markAsError: (messageHash: string, error: string) => Promise<void>;
}

export interface MessageEntity {
  messageHash: string;
  transactionHash: string | undefined;
  error: string | undefined;
  message: SignedMessage;
}

export default IMessageQueueStore;
