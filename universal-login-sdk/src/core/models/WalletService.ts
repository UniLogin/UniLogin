import {ApplicationWallet, SerializableFutureWallet, SerializableConfirmedWallet, SerializableRequestedCreatingWallet} from '@unilogin/commons';
import {ConfirmedWallet} from '../../api/wallet/ConfirmedWallet';
import {DeployedWallet} from '../../api/wallet/DeployedWallet';
import {FutureWallet} from '../../api/wallet/FutureWallet';
import {ConnectingWallet} from '../../api/wallet/ConnectingWallet';
import {DeployingWallet} from '../../api/wallet/DeployingWallet';
import {RequestedCreatingWallet} from '../../api/wallet/RequestedCreatingWallet';

export type SerializedDeployingWallet = ApplicationWallet & {deploymentHash: string};

export type WalletState = {
  kind: 'None';
} | {
  kind: 'RequestedCreating';
  wallet: RequestedCreatingWallet;
} | {
  kind: 'Confirmed';
  wallet: ConfirmedWallet;
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
  kind: 'RequestedCreating';
  wallet: SerializableRequestedCreatingWallet;
} | {
  kind: 'Confirmed';
  wallet: SerializableConfirmedWallet;
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

export interface WalletStorage {
  load(): SerializedWalletState;
  save(state: SerializedWalletState): void;
}
