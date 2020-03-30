import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';

export type StoredFutureWallet = {
  contractAddress: string;
  publicKey: string;
  ensName: string;
  gasPrice: string;
  gasToken: string;
}

export class FutureWalletHandler {
  constructor(private futureWalletStore: FutureWalletStore) {}

  handleFutureWallet(futureWallet: StoredFutureWallet){
    return this.futureWalletStore.add(futureWallet);
  }
}
