import {CollectedSignatureKeyPair, SignedMessage, RepositoryItemState} from '@universal-login/commons';
import MessageItem from '../../models/messages/MessageItem';
import IRepository from './IRepository';

export default interface IMessageRepository extends IRepository<MessageItem> {
  addSignature: (messageHash: string, signature: string) => Promise<void>;
  getMessage: (messageHash: string) => Promise<SignedMessage>;
  getCollectedSignatureKeyPairs: (messageHash: string) => Promise<CollectedSignatureKeyPair[]>;
  markAsPending: (messageHash: string, transactionHash: string) => Promise<void>;
  markAsError: (messageHash: string, error: string) => Promise<void>;
  setState: (messageHash: string, state: RepositoryItemState) => Promise<void>;
  containSignature: (messageHash: string, signature: string) => Promise<boolean>;
}
