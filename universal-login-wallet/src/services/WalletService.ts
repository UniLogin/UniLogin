import UniversalLoginSDK from '@universal-login/sdk';

export interface UserWallet {
  name: string;
  contractAddress: string;
  privateKey: string;
}

type BalanceDetails = {
  tokenAddress: string,
  contractAddress: string
};

export type FutureWallet = {
  privateKey: string,
  contractAddress: string,
  waitForBalance: () => Promise<BalanceDetails>,
  deploy: (ensName: string) => Promise<any>
};

type WalletState = 'None' | 'Future' | 'Deployed';


export default class WalletService {
  public userWallet?: null | UserWallet;
  public state: WalletState = 'None';

  constructor(private sdk: UniversalLoginSDK) {
  }

  walletExists(): boolean {
    return !!this.userWallet;
  }

  isAuthorized(): boolean {
    return this.walletExists();
  }

  disconnect(): void {
    this.userWallet = null;
  }
}
