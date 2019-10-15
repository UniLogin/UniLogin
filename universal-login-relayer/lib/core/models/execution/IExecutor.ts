import {QueueItem} from '../QueueItem';

export interface IExecutor<A> {
  canExecute(item: QueueItem): boolean;
  execute(item: A): Promise<any>;
  handleExecute(hash: string): Promise<any>;
}
