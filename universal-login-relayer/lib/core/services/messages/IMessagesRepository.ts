import {Wallet} from 'ethers';
import {CollectedSignatureKeyPair, MessageStatus, SignedMessage} from '@universal-login/commons';
import MessageItem from '../../models/messages/MessageItem';

export default interface IMessageRepository {
  add: (messageHash: string, pendingMessage: MessageItem) => Promise<void>;
  get: (messageHash: string) => Promise<MessageItem>;
  isPresent: (messageHash: string) => Promise<boolean>;
  remove: (messageHash: string) => Promise<MessageItem>;
  getStatus: (messageHash: string, wallet: Wallet) => Promise<MessageStatus>;
  addSignature: (messageHash: string, signature: string) => Promise<void>;
  getMessage: (messageHash: string) => Promise<SignedMessage>;
  getCollectedSignatureKeyPairs: (messageHash: string) => Promise<CollectedSignatureKeyPair[]>;
  markAsSuccess: (messageHash: string, transactionHash: string) => Promise<void>;
  markAsError: (messageHash: string, error: string) => Promise<void>;
  containSignature: (messageHash: string, signature: string) => Promise<boolean>;
}
