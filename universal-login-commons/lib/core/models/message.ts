import {utils} from 'ethers';
import {Omit, PartialRequired} from '../types/common';

export type Message = MessageCore & PaymentOptions;

export type SignedMessage = MessageCore & SignedMessagePaymentOptions & {signature: string};

export type MessageCore = {
  to: string;
  from: string;
  nonce: string | number;
  data: utils.Arrayish;
  value: utils.BigNumberish;
};

export type PaymentOptions = {
  gasLimit: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  gasToken: string
};

export type SignedMessagePaymentOptions = {
  gasLimitExecution: utils.BigNumberish;
  gasData: utils.BigNumberish;
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

export type MessageWithFrom = PartialRequired<SignedMessage, 'from'>;

export type MessageWithoutFrom = Omit<SignedMessage, 'from'>;

export type MessageState = 'AwaitSignature' | 'Queued' | 'Pending' | 'Error' | 'Success';

export type CollectedSignatureKeyPair = {
  key: string;
  signature: string;
};

export type DecodedMessage = Omit<MessageWithoutFrom, 'nonce'>;

export interface DecodedMessageWithFrom extends DecodedMessage {
  from: string;
}
