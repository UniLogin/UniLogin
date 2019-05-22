import PendingExecution from './pendingExecution';
import IPendingMessagesStore from './IPendingMessagesStore';

export default class PendingMessagesStore implements IPendingMessagesStore {
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