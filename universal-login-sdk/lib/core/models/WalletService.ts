import {ApplicationWallet, SerializableFutureWallet} from '@universal-login/commons';
import {DeployedWallet, FutureWallet} from '../..';

export type WalletState = {
  kind: 'None';
} | {
  kind: 'Future';
  wallet: FutureWallet;
} | {
  kind: 'Connecting';
  wallet: ApplicationWallet;
} | {
  kind: 'Deploying';
  wallet: ApplicationWallet;
  transactionHash?: string;
} | {
  kind: 'Deployed';
  wallet: DeployedWallet;
};

export type SerializedWalletState = {
  kind: 'None';
} | {
  kind: 'Future';
  wallet: SerializableFutureWallet;
} | {
  kind: 'Deployed';
  wallet: ApplicationWallet;
};

export interface WalletStorage {
  load(): SerializedWalletState;
  save(state: SerializedWalletState): void;
}
