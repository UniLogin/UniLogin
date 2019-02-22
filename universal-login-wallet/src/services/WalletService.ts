interface UserWallet {
  name: string;
  address: string;
  privateKey: string;
}

export default class WalletService {
  public userWallet?: UserWallet;
}
