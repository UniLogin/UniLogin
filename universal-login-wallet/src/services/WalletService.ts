export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

export default class WalletService {

  disconnect(): any {
    this.userWallet = null;
  }


  public userWallet?: UserWallet | null;
  walletExists = () => !!this.userWallet;
}
