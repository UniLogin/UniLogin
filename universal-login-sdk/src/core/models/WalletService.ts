import {ApplicationWallet, SerializableFutureWallet, SerializableConfirmedWallet, SerializableRequestedCreatingWallet, SerializableRequestedRestoringWallet, SerializableRestoringWallet} from '@unilogin/commons';
import {ConfirmedWallet} from '../../api/wallet/ConfirmedWallet';
import {DeployedWallet} from '../../api/wallet/DeployedWallet';
import {FutureWallet} from '../../api/wallet/FutureWallet';
import {ConnectingWallet} from '../../api/wallet/ConnectingWallet';
import {DeployingWallet} from '../../api/wallet/DeployingWallet';
import {RequestedCreatingWallet} from '../../api/wallet/RequestedCreatingWallet';
import {RestoringWallet} from '../../api/wallet/RestoringWallet';
import {RequestedRestoringWallet} from '../../api/wallet/RequestedRestoringWallet';

export type SerializedDeployingWallet = ApplicationWallet & {email?: string, deploymentHash: string};
export type SerializedDeployedWallet = ApplicationWallet & {email?: string};
export type SerializedDeployedWithoutEmailWallet = ApplicationWallet;

export type WalletState = {
  kind: 'None';
} | {
  kind: 'RequestedCreating';
  wallet: RequestedCreatingWallet;
} | {
  kind: 'Restoring';
  wallet: RestoringWallet;
} | {
  kind: 'RequestedRestoring';
  wallet: RequestedRestoringWallet;
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
  kind: 'DeployedWithoutEmail';
  wallet: DeployedWallet;
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
  kind: 'Restoring';
  wallet: SerializableRestoringWallet;
} | {
  kind: 'RequestedRestoring';
  wallet: SerializableRequestedRestoringWallet;
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
  kind: 'DeployedWithoutEmail';
  wallet: SerializedDeployedWallet;
} | {
  kind: 'Deployed';
  wallet: SerializedDeployedWallet;
};

export interface WalletStorage {
  load(): SerializedWalletState;
  save(state: SerializedWalletState): void;
}
