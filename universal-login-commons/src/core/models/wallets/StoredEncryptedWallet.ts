import {EncryptedWallet, asEncryptedWallet} from './EncryptedWallet';
import {asObject, asString} from '@restless/sanitizers';

export interface StoredEncryptedWallet {
  email: string;
  ensName: string;
  walletJSON: EncryptedWallet;
  contractAddress: string;
  publicKey: string;
}

export const asStoredEncryptedWallet = asObject<StoredEncryptedWallet>({
  email: asString,
  ensName: asString,
  walletJSON: asEncryptedWallet,
  contractAddress: asString,
  publicKey: asString,
});
