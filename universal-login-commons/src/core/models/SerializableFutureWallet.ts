export interface SerializableFutureWallet {
  contractAddress: string;
  privateKey: string;
  gasPrice: string;
  ensName: string;
  gasToken: string;
}

export interface StoredFutureWallet {
  contractAddress: string;
  publicKey: string;
  ensName: string;
  gasPrice: string;
  gasToken: string;
  tokenPriceInETH: string;
};
