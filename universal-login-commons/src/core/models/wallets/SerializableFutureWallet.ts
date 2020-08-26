import {asObject, asString} from '@restless/sanitizers';
import {asEthAddress} from '@restless/ethereum';

export interface SerializableFutureWallet {
  contractAddress: string;
  privateKey: string;
  gasPrice: string;
  ensName: string;
  gasToken: string;
  email?: string;
}

export interface StoredFutureWallet {
  contractAddress: string;
  publicKey: string;
  ensName: string;
  gasPrice: string;
  gasToken: string;
  tokenPriceInETH: string;
};

export type StoredFutureWalletRequest = Omit<StoredFutureWallet, 'tokenPriceInETH'>;

export const asStoredFutureWalletRequest = asObject<StoredFutureWalletRequest>({
  contractAddress: asEthAddress,
  publicKey: asEthAddress,
  ensName: asString,
  gasPrice: asString,
  gasToken: asString,
});
