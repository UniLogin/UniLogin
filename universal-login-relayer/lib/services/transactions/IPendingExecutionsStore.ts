import PendingExecution from '../../utils/pendingExecution';

export default interface IPendingExecutionsStore {
  add: (hash: string, pendingExecution: PendingExecution) => string;
  get: (hash: string) => PendingExecution;
  isPresent: (hash: string) => boolean;
  remove: (hash: string) => PendingExecution;
}