import {BalanceDetails} from '../FutureWalletFactory';
import {SerializableFutureWallet} from '@universal-login/commons';
import {DeployingWallet} from './DeployingWallet';

export interface FutureWallet extends SerializableFutureWallet {
  waitForBalance: () => Promise<BalanceDetails>;
  deploy: (ensName: string, gasPrice: string, gasToken: string) => Promise<DeployingWallet>;
}
