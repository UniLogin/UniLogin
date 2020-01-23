import {ApplicationWallet, SerializableFutureWallet} from '@universal-login/commons';
import {DeployedWallet} from '../../api/wallet/DeployedWallet';
import {FutureWallet} from '../../api/wallet/FutureWallet';
import {ConnectingWallet} from '../../api/wallet/ConnectingWallet';
import {DeployingWallet} from '../../api/wallet/DeployingWallet';

export type SerializedDeployingWallet = ApplicationWallet & {deploymentHash: string};

export type WalletState = {
  kind: 'None';
} | {
  kind: 'Future';
  name: string;
  wallet: FutureWallet;
} | {
  kind: 'Connecting';
  wallet: ConnectingWallet;
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
  kind: 'Deploying';
  wallet: SerializedDeployingWallet;
} | {
  kind: 'Connecting';
  wallet: ApplicationWallet;
} | {
  kind: 'Deployed';
  wallet: ApplicationWallet;
};

export interface IStorageService {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface WalletStorage {
  load(): SerializedWalletState;
  save(state: SerializedWalletState): void;
}
