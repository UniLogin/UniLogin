import {asString, asObject} from '@restless/sanitizers';

export interface SerializableRequestedMigratingWallet {
  ensName: string;
  contractAddress: string;
  email: string;
  privateKey: string;
}

export const asSerializableRequestedMigratingWallet = asObject<SerializableRequestedMigratingWallet>({
  contractAddress: asString,
  ensName: asString,
  email: asString,
  privateKey: asString,
});
