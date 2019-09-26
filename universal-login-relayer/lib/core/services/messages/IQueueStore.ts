import {SignedMessage} from '@universal-login/commons';
import {QueueItem} from '../../models/messages/QueueItem';

export interface IQueueStore <A, B, C> {
  add (item: A) : Promise<string>;
  getNext: () => Promise<B | undefined>;
  remove: (item: C) => Promise<void>;
}

export interface IMessageQueue extends IQueueStore<SignedMessage, QueueItem, string> {}
