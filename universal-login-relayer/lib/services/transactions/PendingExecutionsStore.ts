import PendingExecution from '../../utils/pendingExecution';
import IPendingExecutionsStore from './IPendingExecutionsStore';

export default class PendingExecutionsStore implements IPendingExecutionsStore {
  public executions: Record<string, PendingExecution>;

  constructor () {
    this.executions = {};
  }

  add(hash: string, execution: PendingExecution) {
    this.executions[hash] = execution;
    return hash;
  }

  isPresent(hash: string) {
    return hash in this.executions;
  }
}