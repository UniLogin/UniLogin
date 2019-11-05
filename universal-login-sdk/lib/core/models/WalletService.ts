import {ApplicationWallet, CounterfactualWallet} from '@universal-login/commons';
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
} | {
  kind: 'Deployed';
  wallet: DeployedWallet;
};

export type SerializedWalletState = {
  kind: 'Future';
  wallet: CounterfactualWallet;
} | {
  kind: 'Deployed';
  wallet: ApplicationWallet;
};

export interface WalletStorage {
  load(): SerializedWalletState | null;
  save(state: SerializedWalletState): void;
  remove(): void;
}
