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
<<<<<<< HEAD
  getCollectedSignatureKeyPairs: (messageHash: string) => CollectedSignatureKeyPair[];
=======
  getCollectedSignatures: (messageHash: string) => CollectedSignature[];
>>>>>>> Introduce get signatures (PendingMessagesStore)
  updateTransactionHash: (messageHash: string, transactionHash: string) => void;
  containSignature: (messageHash: string, signature: string) => boolean;
}

<<<<<<< HEAD
export type CollectedSignatureKeyPair = {
=======
export type CollectedSignature = {
>>>>>>> Introduce get signatures (PendingMessagesStore)
  key: string;
  signature: string;
};
