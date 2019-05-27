import {Wallet} from 'ethers';
import {MessageStatus} from '@universal-login/commons';
import PendingMessage from './PendingMessage';

export default interface IPendingMessagesStore {
  add: (messageHash: string, pendingMessage: PendingMessage) => void;
  get: (messageHash: string) => PendingMessage;
  isPresent: (messageHash: string) => boolean;
  remove: (messageHash: string) => PendingMessage;
  getStatus: (messageHash: string, wallet: Wallet) => Promise<MessageStatus>;
  addSignature: (messageHash: string, signature: string) => void;
  getCollectedSignatureKeyPairs: (messageHash: string) => CollectedSignatureKeyPair[];
  updateTransactionHash: (messageHash: string, transactionHash: string) => void;
  containSignature: (messageHash: string, signature: string) => boolean;
}

export type CollectedSignatureKeyPair = {
  key: string;
  signature: string;
};
