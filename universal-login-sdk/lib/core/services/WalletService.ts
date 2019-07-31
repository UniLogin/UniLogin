import {ensure, ApplicationWallet} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {FutureWallet} from '../../api/FutureWalletFactory';
import {WalletOverridden, FutureWalletNotSet} from '../utils/errors';

type WalletState = 'None' | 'Future' | 'Deployed';

export class WalletService {
  public applicationWallet?: FutureWallet | ApplicationWallet;
  public state: WalletState = 'None';

  constructor(private sdk: UniversalLoginSDK) {
  }

  walletDeployed(): boolean {
    return this.state === 'Deployed';
  }

  isAuthorized(): boolean {
    return this.walletDeployed();
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const futureWallet = await this.sdk.createFutureWallet();
    this.setFutureWallet(futureWallet);
    return futureWallet;
  }

  setFutureWallet(applicationWallet: FutureWallet) {
    ensure(this.state === 'None', WalletOverridden);
    this.state = 'Future';
    this.applicationWallet = applicationWallet;
  }

  setDeployed(name: string) {
    ensure(this.state === 'Future', FutureWalletNotSet);
    const {contractAddress, privateKey} = this.applicationWallet!;
    this.state = 'Deployed';
    this.applicationWallet = {
      name,
      contractAddress,
      privateKey
    };
  }

  connect(applicationWallet: ApplicationWallet) {
    ensure(this.state === 'None', WalletOverridden);
    this.state = 'Deployed';
    this.applicationWallet = applicationWallet;
  }

  disconnect(): void {
    this.state = 'None';
    this.applicationWallet = undefined;
  }
}
