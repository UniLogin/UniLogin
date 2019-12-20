import {QueueItem} from '../QueueItem';
import Deployment from '../Deployment';

export interface IExecutionQueue {
  addMessage (messageHash: string): Promise<string>;
  addDeployment (item: Deployment): Promise<string>;
  getNext: () => Promise<QueueItem | undefined>;
  remove: (hash: string) => Promise<void>;
}
