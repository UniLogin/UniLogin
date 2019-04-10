import {utils} from 'ethers';

export type Procedure = (...args: any[]) => void;

export type Predicate = (...args: any[]) => boolean;

export interface Message {
  gasToken: string;
  operationType: number;
  to: string;
  from: string;
  nonce: number | string;
  gasLimit: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  data: utils.Arrayish;
  value: utils.BigNumberish;
  chainId: number;
  signature: string;
}
