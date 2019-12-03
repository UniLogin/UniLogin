import {ApplicationWallet, SerializableFutureWallet} from '@universal-login/commons';
import {DeployedWallet, FutureWallet} from '../..';
import {Deployment} from '../../api/FutureWalletFactory';

export type DeployingWallet = Deployment & ApplicationWallet;

export type WalletState = {
  kind: 'None';
} | {
  kind: 'Future';
  name: string;
  wallet: FutureWallet;
} | {
  kind: 'Connecting';
  wallet: ApplicationWallet;
} | {
  kind: 'Deploying';
  wallet: DeployingWallet;
  transactionHash?: string;
} | {
  kind: 'Deployed';
  wallet: DeployedWallet;
};

export type SerializedWalletState = {
  kind: 'None';
} | {
  kind: 'Future';
  name: string;
  wallet: SerializableFutureWallet;
} | {
  kind: 'Deployed';
  wallet: ApplicationWallet;
};

export interface WalletStorage {
  load(): SerializedWalletState;
  save(state: SerializedWalletState): void;
}
