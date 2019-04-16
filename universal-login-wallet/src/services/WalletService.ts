export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

export default class WalletService {
  authorized: boolean = false;
  setAuthorized = (value: boolean) => this.authorized = value;

  public userWallet?: UserWallet | null;
  walletExists = () => !!this.userWallet;

  disconnect(): any {
    this.userWallet = null;
    this.setAuthorized(false);
  }
}
