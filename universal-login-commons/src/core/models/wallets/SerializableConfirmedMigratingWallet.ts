import {asString, asObject} from '@restless/sanitizers';

export interface SerializableConfirmedMigratingWallet {
  ensName: string;
  contractAddress: string;
  email: string;
  privateKey: string;
  code: string;
}

export const asSerializableConfirmedMigratingWallet = asObject<SerializableConfirmedMigratingWallet>({
  contractAddress: asString,
  ensName: asString,
  email: asString,
  privateKey: asString,
  code: asString,
});
