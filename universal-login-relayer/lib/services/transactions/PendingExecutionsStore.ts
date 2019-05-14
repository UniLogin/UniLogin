import PendingExecution from '../../utils/pendingExecution';
import IPendingExecutionsStore from './IPendingExecutionsStore';

export default class PendingExecutionsStore implements IPendingExecutionsStore {
  public executions: Record<string, PendingExecution>;

  constructor () {
    this.executions = {};
  }

  add(messageHash: string, execution: PendingExecution) {
    this.executions[messageHash] = execution;
  }

  isPresent(messageHash: string) {
    return messageHash in this.executions;
  }

  get(messageHash: string): PendingExecution {
    return this.executions[messageHash];
  }

  remove(messageHash: string): PendingExecution {
    const pendingExecution = this.executions[messageHash];
    delete this.executions[messageHash];
    return pendingExecution;
  }
}