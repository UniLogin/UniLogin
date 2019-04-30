import {utils} from 'ethers';
import {QueryBuilder} from 'knex';

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

export interface Notification {
  id: number;
  key: string;
  walletContractAddress: string;
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  ipAddress: string;
  name: string;
  city: string;
  os: string;
  browser: string;
  time: string;
}

export interface ITransactionQueueStore {
  add: (transaction: Partial<utils.Transaction>) => Promise<string>;
  getNext: () => Promise<{
    id: string;
    hash: string | undefined;
    error: string | undefined;
    message: Partial<utils.Transaction>;
  } | undefined>;
  onSuccessRemove: (id: string, hash: string) => Promise<void>;
  onErrorRemove: (id: string, error: string) => Promise<void>;
}