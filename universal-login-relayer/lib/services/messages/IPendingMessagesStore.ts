import PendingMessage from './PendingMessage';
import {InvalidExecution} from '../../utils/errors';

export type MessageStatus = {
  collectedSignatures: string[],
  totalCollected: number,
  required: number,
  transactionHash: string
}

export default interface IPendingMessagesStore {
  add: (messageHash: string, pendingMessage: PendingMessage) => void;
  get: (messageHash: string) => PendingMessage;
  isPresent: (messageHash: string) => boolean;
  remove: (messageHash: string) => PendingMessage;
  getStatus: (messageHash: string) => Promise<MessageStatus | InvalidExecution>;
}
