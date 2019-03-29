export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

export default class WalletService {

  disconnect(): any {
    this.userWallet = {name: '', contractAddress: '', privateKey: ''};
  }


  public userWallet?: UserWallet;
  walletExists = () => !!this.userWallet;
}
