import PendingExecution from '../../utils/pendingExecution';

export default class PendingExecutionsStore {
  public executions: Record<string, PendingExecution>;

  constructor () {
    this.executions = {};
  }
}