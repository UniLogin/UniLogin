import {asObject, asString} from '@restless/sanitizers';

export interface SerializableRequestedWallet {
  email: string;
  ensName: string;
}

export const asSerializableRequestedWallet = asObject<SerializableRequestedWallet>({
  email: asString,
  ensName: asString,
});
