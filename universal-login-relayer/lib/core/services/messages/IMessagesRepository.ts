import {CollectedSignatureKeyPair, SignedMessage, MessageState} from '@universal-login/commons';
import MessageItem from '../../models/messages/MessageItem';

export default interface IMessageRepository {
  add: (messageHash: string, pendingMessage: MessageItem) => Promise<void>;
  get: (messageHash: string) => Promise<MessageItem>;
  isPresent: (messageHash: string) => Promise<boolean>;
  remove: (messageHash: string) => Promise<MessageItem>;
  addSignature: (messageHash: string, signature: string) => Promise<void>;
  getMessage: (messageHash: string) => Promise<SignedMessage>;
  getCollectedSignatureKeyPairs: (messageHash: string) => Promise<CollectedSignatureKeyPair[]>;
  markAsPending: (messageHash: string, transactionHash: string) => Promise<void>;
  markAsSuccess: (messageHash: string, transactionHash: string) => Promise<void>;
  markAsError: (messageHash: string, error: string) => Promise<void>;
  setMessageState: (messageHash: string, state: MessageState) => Promise<void>;
  containSignature: (messageHash: string, signature: string) => Promise<boolean>;
}
