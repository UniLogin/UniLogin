import {ApplicationInfo} from '@universal-login/commons';
import Web3 from 'web3';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {Network, getConfigForNetwork} from '../config';
import {StorageService} from '@universal-login/react';

export interface SetupUniLoginOverrides {
  applicationInfo?: ApplicationInfo;
  storageService?: StorageService;
}

export const setupUniLogin = (web3: Web3, overrides?: SetupUniLoginOverrides) => ({
  name: 'UniversalLogin',
  icon: 'UniversalLogin logo',
  create: async () => {
    const networkVersion = (await web3.eth.net.getId()).toString() as Network;
    const uniLoginConfig = getConfigForNetwork(networkVersion);
    const provider = new ULWeb3Provider({
      provider: uniLoginConfig.provider,
      relayerUrl: uniLoginConfig.relayerUrl,
      ensDomains: uniLoginConfig.ensDomains,
      applicationInfo: overrides?.applicationInfo,
      storageService: overrides?.storageService,
    });
    await provider.init();
    return provider;
  },
});
