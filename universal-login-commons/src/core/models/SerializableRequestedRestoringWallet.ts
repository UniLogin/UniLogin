import {asObject, asString} from '@restless/sanitizers';

export interface SerializableRequestedRestoringWallet {
  ensNameOrEmail: string;
}

export const asSerializableRequestedRestoringWallet = asObject<SerializableRequestedRestoringWallet>({
  ensNameOrEmail: asString,
});
