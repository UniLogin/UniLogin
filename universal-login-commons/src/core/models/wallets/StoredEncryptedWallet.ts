import {EncryptedWallet} from './EncryptedWallet';

export interface StoredEncryptedWallet {
  email: string;
  ensName: string;
  walletJSON: EncryptedWallet;
}
