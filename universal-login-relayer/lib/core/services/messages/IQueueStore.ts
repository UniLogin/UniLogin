import {SignedMessage} from '@universal-login/commons';
import {QueueItem} from '../../models/messages/QueueItem';

export interface IQueueStore {
  add: (message: SignedMessage) => Promise<string>;
  getNext: () => Promise<QueueItem | undefined>;
  remove: (messageHash: string) => Promise<void>;
}


export default IQueueStore;
