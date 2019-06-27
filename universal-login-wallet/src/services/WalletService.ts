import UniversalLoginSDK, {FutureWallet} from '@universal-login/sdk';

export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

type WalletState = 'None' | 'Future' | 'Deployed';


export default class WalletService {
  public userWallet?: null | FutureWallet | UserWallet;
  public state: WalletState = 'None';

  constructor(private sdk: UniversalLoginSDK) {
  }

  walletExists(): boolean {
    return !!this.userWallet;
  }

  isAuthorized(): boolean {
    return this.walletExists();
  }

  setUserWallet(userWallet: UserWallet) {
    this.state = 'Deployed';
    this.userWallet = userWallet;
  }

  disconnect(): void {
    this.userWallet = null;
  }
}
