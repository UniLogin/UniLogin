import {asString, asObject} from '@restless/sanitizers';
import {EncryptedWallet, asEncryptedWallet} from './EncryptedWallet';

export interface SerializableRestoringWallet {
  contractAddress: string;
  encryptedWallet: EncryptedWallet;
  ensName: string;
  email: string;
}

export const asSerializableRestoringWallet = asObject<SerializableRestoringWallet>({
  contractAddress: asString,
  encryptedWallet: asEncryptedWallet,
  ensName: asString,
  email: asString,
});
