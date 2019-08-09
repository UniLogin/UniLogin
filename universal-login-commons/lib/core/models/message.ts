import {utils} from 'ethers';
import {Omit, PartialRequired} from '../types/common';

export type Message = Partial<SignedMessage>;

export type MessageWithFrom = PartialRequired<SignedMessage, 'from'>;

export type MessageWithoutFrom = Omit<SignedMessage, 'from'>;

export interface SignedMessage extends PaymentOptions {
  operationType: number;
  to: string;
  from: string;
  nonce: string | number;
  data: utils.Arrayish;
  value: utils.BigNumberish;
  signature: string;
}

export type PaymentOptions = {
  gasLimit: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  gasToken: string
};

export type UnsignedMessage = Omit<SignedMessage, 'signature'>;

export type MessageStatus = {
  messageHash: string,
  error?: string,
  transactionHash?: string,
  collectedSignatures: string[],
  totalCollected: number,
  required: number,
  state: MessageState
};

export type MessageState = 'AwaitSignature' | 'Queued' | 'Pending' | 'Error' | 'Success';

export type CollectedSignatureKeyPair = {
  key: string;
  signature: string;
};
