import {SignedMessage} from '@universal-login/commons';
import {QueueItem} from '../QueueItem';
import Deployment from '../Deployment';

export interface IExecutionQueue {
  addMessage (item: SignedMessage): Promise<string>;
  addDeployment (item: Deployment): Promise<string>;
  getNext: () => Promise<QueueItem | undefined>;
  remove: (hash: string) => Promise<void>;
}
