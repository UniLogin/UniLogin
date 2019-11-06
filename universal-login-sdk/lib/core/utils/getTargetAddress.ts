import UniversalLoginSDK from '../..';
import {isProperAddress, ensure} from '@universal-login/commons';
import {InvalidAddressOrEnsName} from './errors';

export const getTargetAddress = async (sdk: UniversalLoginSDK, addressOrEnsName: string) => {
  if(isProperAddress(addressOrEnsName)) {
    return addressOrEnsName;
  } else {
    const address = await sdk.resolveName(addressOrEnsName);
    ensure(address, InvalidAddressOrEnsName, addressOrEnsName);
    return address;
  }
};
