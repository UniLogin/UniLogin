interface UserWallet {
  name: string;
  address: string;
  privateKey: string;
}

export default class UserWalletService {
  public userWallet?: UserWallet;
}
