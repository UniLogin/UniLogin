import PendingExecution from '../../utils/pendingExecution';

export default interface IPendingMessagesStore {
  add: (messageHash: string, pendingExecution: PendingExecution) => void;
  get: (messageHash: string) => PendingExecution;
  isPresent: (messageHash: string) => boolean;
  remove: (messageHash: string) => PendingExecution;
}