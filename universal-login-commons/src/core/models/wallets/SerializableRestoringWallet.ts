import {asString, asObject} from '@restless/sanitizers';
import {EncryptedWallet, asEncryptedWallet} from './EncryptedWallet';

export interface SerializableRestoringWallet {
  ensName: string;
  contractAddress: string;
  encryptedWallet: EncryptedWallet;
}

export const asSerializableRestoringWallet = asObject<SerializableRestoringWallet>({
  contractAddress: asString,
  ensName: asString,
  encryptedWallet: asEncryptedWallet,
});
