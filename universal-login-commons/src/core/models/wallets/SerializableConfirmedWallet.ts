import {asObject, asString} from '@restless/sanitizers';

export interface SerializableConfirmedWallet {
  email: string;
  ensName: string;
  code: string;
}

export const asSerializableConfirmedWallet = asObject<SerializableConfirmedWallet>({
  email: asString,
  ensName: asString,
  code: asString,
});
