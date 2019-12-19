import UniversalLoginSDK from '../..';
import {isProperAddress, ensureNotNull} from '@universal-login/commons';
import {InvalidAddressOrEnsName} from './errors';

export const getTargetAddress = async (sdk: UniversalLoginSDK, addressOrEnsName: string) => {
  if (isProperAddress(addressOrEnsName)) {
    return addressOrEnsName;
  } else {
    const address = await sdk.resolveName(addressOrEnsName);
    ensureNotNull(address, InvalidAddressOrEnsName, addressOrEnsName);
    return address;
  }
};
