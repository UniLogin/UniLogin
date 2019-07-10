import {SignedMessage, MessageQueueStatus} from '@universal-login/commons';
import {MessageEntity} from '../../models/messages/MessageEntity';

export interface IMessageQueueStore {
  add: (message: SignedMessage) => Promise<string>;
  get: (messageHash: string) => Promise<MessageEntity | undefined>;
  getStatus: (messageHash: string) => Promise<MessageQueueStatus | undefined>;
  getNext: () => Promise<MessageEntity | undefined>;
  remove: (messageHash: string) => Promise<void>;
}


export default IMessageQueueStore;
