import UniversalLoginSDK, {FutureWallet} from '@universal-login/sdk';
import {ensure} from '@universal-login/commons';
import {WalletOverriden, FutureWalletNotSet} from '../../services/utils/errors';
import UserWallet from '../../core/entities/UserWallet';

type WalletState = 'None' | 'Future' | 'Deployed';

export default class WalletService {
  public userWallet?: FutureWallet | UserWallet;
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

  setFutureWallet(userWallet: FutureWallet) {
    ensure(this.state === 'None', WalletOverriden);
    this.state = 'Future';
    this.userWallet = userWallet;
  }

  setDeployed(name: string) {
    ensure(this.state === 'Future', FutureWalletNotSet);
    const {contractAddress, privateKey} = this.userWallet!;
    this.state = 'Deployed';
    this.userWallet = {
      name,
      contractAddress,
      privateKey
    };
  }

  connect(userWallet: UserWallet) {
    ensure(this.state === 'None', WalletOverriden);
    this.state = 'Deployed';
    this.userWallet = userWallet;
  }

  disconnect(): void {
    this.state = 'None';
    this.userWallet = undefined;
  }
}
