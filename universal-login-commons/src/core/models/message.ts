import {utils} from 'ethers';
import {Omit, PartialRequired} from '../types/common';

export type Message = MessageCore & PaymentOptions;

export type SignedMessage = MessageCore & SignedMessagePaymentOptions & {signature: string};

export enum OperationType {
  call,
  externalCall,
}

export type MessageCore = {
  to: string;
  from: string;
  nonce: string | number;
  data: utils.Arrayish;
  value: utils.BigNumberish;
  operationType: OperationType;
};

export type PaymentOptions = {
  gasLimit: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  gasToken: string;
  refundReceiver: string;
};

export type ExecutionOptions = {
  gasPrice: utils.BigNumberish;
  gasLimit?: utils.BigNumberish;
  gasToken?: string;
  nonce?: string | number;
};

export type SdkExecutionOptions = ExecutionOptions & Required<Pick<ExecutionOptions, 'gasLimit'>>;

export type SignedMessagePaymentOptions = {
  safeTxGas: utils.BigNumberish;
  baseGas: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  gasToken: string;
  refundReceiver: string;
};

export type UnsignedMessage = Omit<SignedMessage, 'signature'>;

export type MessageStatus = {
  messageHash: string;
  error?: string;
  transactionHash?: string;
  collectedSignatures: string[];
  totalCollected: number;
  state: MessageState;
};

export type DeploymentStatus = {
  deploymentHash: string;
  error: string | null;
  transactionHash: string | null;
  state: DeploymentState;
};

export type MessageWithFrom = PartialRequired<SignedMessage, 'from'>;

export type MessageWithoutFrom = Omit<SignedMessage, 'from'>;

export type DeploymentState = 'Queued' | 'Pending' | 'Error' | 'Success';
export type MessageState = 'AwaitSignature' | DeploymentState;
export type MineableState = DeploymentState | MessageState;

export type MineableStatus = MessageStatus | DeploymentStatus;

export type CollectedSignatureKeyPair = {
  key: string;
  signature: string;
};

export type DecodedMessage = Omit<MessageWithoutFrom, 'nonce'|'refundReceiver'|'operationType'>;

export type DecodedMessageGnosis = Omit<MessageWithoutFrom, 'nonce'>;

export interface DecodedMessageWithFrom extends DecodedMessage {
  from: string;
}
