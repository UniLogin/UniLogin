export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

export default class WalletService {
  public userWallet?: UserWallet;
  walletExists = () => !!this.userWallet;
}
