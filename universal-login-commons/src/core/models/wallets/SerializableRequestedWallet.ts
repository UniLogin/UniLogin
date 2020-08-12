import {asObject, asString} from '@restless/sanitizers';

export interface SerializableRequestedCreatingWallet {
  email: string;
  ensName: string;
}

export const asSerializableRequestedCreatingWallet = asObject<SerializableRequestedCreatingWallet>({
  email: asString,
  ensName: asString,
});
