export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

export default class WalletService {
  public userWallet?: UserWallet | null;
  walletExists = () => !!this.userWallet;

  isAuthorized = () => this.walletExists();

  disconnect(): any {
    this.userWallet = null;
  }
}
