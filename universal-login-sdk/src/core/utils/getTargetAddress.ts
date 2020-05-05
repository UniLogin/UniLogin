import UniLoginSdk from '../..';
import {isProperAddress, ensureNotFalsy} from '@unilogin/commons';
import {InvalidAddressOrEnsName} from './errors';

export const getTargetAddress = async (sdk: UniLoginSdk, addressOrEnsName: string) => {
  if (isProperAddress(addressOrEnsName)) {
    return addressOrEnsName;
  } else {
    const address = await sdk.resolveName(addressOrEnsName);
    ensureNotFalsy(address, InvalidAddressOrEnsName, addressOrEnsName);
    return address;
  }
};
