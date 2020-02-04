import {ApplicationInfo} from '@universal-login/commons';
import Web3 from 'web3';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {Network} from '../config';

interface SetupUniLoginOverrides {
  applicationInfo?: ApplicationInfo;
}

export const setupUniLogin = (web3: Web3, overrides?: SetupUniLoginOverrides) => ({
  name: 'UniversalLogin',
  icon: 'UniversalLogin logo',
  create: async () => {
    const networkVersion = (await web3.eth.net.getId()).toString() as Network;
    const provider = ULWeb3Provider.getDefaultProvider(networkVersion, overrides?.applicationInfo);
    await provider.init();
    return provider;
  },
});
