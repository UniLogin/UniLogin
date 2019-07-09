import {Wallet} from 'ethers';
import {MessageStatus} from '@universal-login/commons';
import PendingMessage from '../../models/messages/PendingMessage';

export default interface IPendingMessagesStore {
  add: (messageHash: string, pendingMessage: PendingMessage) => Promise<void>;
  get: (messageHash: string) => Promise<PendingMessage>;
  isPresent: (messageHash: string) => Promise<boolean>;
  remove: (messageHash: string) => Promise<PendingMessage>;
  getStatus: (messageHash: string, wallet: Wallet) => Promise<MessageStatus>;
  addSignature: (messageHash: string, signature: string) => Promise<void>;
  getCollectedSignatureKeyPairs: (messageHash: string) => Promise<CollectedSignatureKeyPair[]>;
  markAsSuccess: (messageHash: string, transactionHash: string) => Promise<void>;
  markAsError: (messageHash: string, error: string) => Promise<void>;
  containSignature: (messageHash: string, signature: string) => Promise<boolean>;
}

export type CollectedSignatureKeyPair = {
  key: string;
  signature: string;
};
