import UniversalLoginSDK, {FutureWallet} from '@universal-login/sdk';
import { ensure } from '@universal-login/commons/lib';

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

  walletExists(): boolean {
    return !!this.userWallet;
  }

  isAuthorized(): boolean {
    return this.walletExists();
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const futureWallet = await this.sdk.createFutureWallet();
    this.setFutureWallet(futureWallet);
    return futureWallet;
  }

  setFutureWallet(userWallet: FutureWallet) {
    this.state = 'Future';
    this.userWallet = userWallet;
  }

  connect(userWallet: UserWallet) {
    this.state = 'Deployed';
    this.userWallet = userWallet;
  }

  disconnect(): void {
    this.state = 'None';
    this.userWallet = undefined;
  }
}
