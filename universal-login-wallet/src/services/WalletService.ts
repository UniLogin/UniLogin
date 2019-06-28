import UniversalLoginSDK, {FutureWallet} from '@universal-login/sdk';
import {ensure} from '@universal-login/commons';

export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

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
    ensure(this.state === 'None', Error, 'Wallet cannot be overrided');
    this.state = 'Future';
    this.userWallet = userWallet;
  }

  setDeployed(name: string) {
    ensure(this.state === 'Future', Error, 'Future wallet was not setted');
    const {contractAddress, privateKey} = this.userWallet!;
    this.state = 'Deployed';
    this.userWallet = {
      name,
      contractAddress,
      privateKey
    };
  }

  connect(userWallet: UserWallet) {
    ensure(this.state === 'None', Error, 'Wallet cannot be overrided');
    this.state = 'Deployed';
    this.userWallet = userWallet;
  }

  disconnect(): void {
    this.state = 'None';
    this.userWallet = undefined;
  }
}
