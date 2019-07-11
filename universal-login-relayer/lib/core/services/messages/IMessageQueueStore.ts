import {SignedMessage} from '@universal-login/commons';
import {MessageEntity} from '../../models/messages/MessageEntity';

export interface IMessageQueueStore {
  add: (message: SignedMessage) => Promise<string>;
  getNext: () => Promise<MessageEntity | undefined>;
  remove: (messageHash: string) => Promise<void>;
}


export default IMessageQueueStore;
