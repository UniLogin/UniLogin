import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {Strategy} from './UniLogin';
import {getConfigForNetwork, Network} from '../config';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {ApplicationInfo} from '@unilogin/commons';
import {StorageService} from '@unilogin/react';
import UniLoginLogo from '../ui/assets/U.svg';
import MetamaskLogo from '../ui/assets/MetaMaskLogoTitle.svg';
import {Provider} from 'web3/providers';
import {getNetworkId} from '../utils/getNetworkId';

export interface SetupUniLoginOverrides {
  applicationInfo?: ApplicationInfo;
  storageService?: StorageService;
}

export const setupUniLogin = (provider: Provider, overrides?: SetupUniLoginOverrides) => ({
  name: 'UniLogin',
  icon: UniLoginLogo,
  create: async () => {
    const networkVersion = await getNetworkId(provider) as Network;
    const uniLoginConfig = getConfigForNetwork(networkVersion);
    const ulProvider = new ULWeb3Provider({
      ...uniLoginConfig,
      applicationInfo: overrides?.applicationInfo,
      storageService: overrides?.storageService,
    });
    await ulProvider.init();
    return ulProvider;
  },
});

export const setupStrategies = (provider: Provider, strategies: Strategy[], overrides?: SetupUniLoginOverrides) => {
  return strategies.map(strategy => {
    switch (strategy) {
      case 'UniLogin':
        return setupUniLogin(provider, overrides);
      case 'Metamask':
        const defaultStrategy: Web3ProviderFactory = {icon: MetamaskLogo, name: 'Metamask', create: () => provider};
        return defaultStrategy;
      default:
        return strategy;
    }
  });
};
