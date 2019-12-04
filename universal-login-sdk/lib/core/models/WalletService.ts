import {ApplicationWallet, SerializableFutureWallet} from '@universal-login/commons';
import {DeployedWallet, FutureWallet} from '../..';
import {ConnectingWallet} from '../../api/DeployedWallet';
import {DeployingWallet} from '../../api/FutureWalletFactory';

export type SerializedDeployingWallet = ApplicationWallet & {deploymentHash: string}

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
  kind: 'Deployed';
  wallet: ApplicationWallet;
};

export interface WalletStorage {
  load(): SerializedWalletState;
  save(state: SerializedWalletState): void;
}
