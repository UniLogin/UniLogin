import PendingExecution from '../../utils/pendingExecution';

export default interface IPendingExecutionsStore {
  add: (hash: string, pendingExecution: PendingExecution) => string;
  isPresent: (hash: string) => boolean;
}