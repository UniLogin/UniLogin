import {QueueItem} from '../QueueItem';

export interface IExecutionQueue {
  addMessage (messageHash: string): Promise<string>;
  addDeployment (deploymentHash: string): Promise<string>;
  getNext: () => Promise<QueueItem | undefined>;
  remove: (hash: string) => Promise<void>;
}
