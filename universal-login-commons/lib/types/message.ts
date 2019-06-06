import {utils} from 'ethers';
import {Omit, PartialRequired} from './common';

export type Message = Partial<SignedMessage>;

export type MessageWithFrom = PartialRequired<SignedMessage, 'from'>;

export interface SignedMessage {
  gasToken: string;
  operationType: number;
  to: string;
  from: string;
  nonce: string | number;
  gasLimit: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  data: utils.Arrayish;
  value: utils.BigNumberish;
  signature: string;
}

export type UnsignedMessage = Omit<SignedMessage, 'signature'>;

export type MessageStatus = {
  collectedSignatures: string[],
  totalCollected: number,
  required: number,
  transactionHash: string
};

export type MessageWithoutFrom = Omit<SignedMessage, 'from'>;
