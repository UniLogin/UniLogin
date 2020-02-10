import Web3 from 'web3';
import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {Strategy} from './UniLogin';
import {getConfigForNetwork, Network} from '../config';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {ApplicationInfo} from '@universal-login/commons';
import {StorageService} from '@universal-login/react';
import UniLoginLogo from '../ui/assets/U.svg';
import MetamaskLogo from '../ui/assets/MetaMaskLogoTitle.svg';

export interface SetupUniLoginOverrides {
  applicationInfo?: ApplicationInfo;
  storageService?: StorageService;
}

export const setupUniLogin = (web3: Web3, overrides?: SetupUniLoginOverrides) => ({
  name: 'UniversalLogin',
  icon: UniLoginLogo,
  create: async () => {
    const networkVersion = (await web3.eth.net.getId()).toString() as Network;
    const uniLoginConfig = getConfigForNetwork(networkVersion);
    const provider = new ULWeb3Provider({
      ...uniLoginConfig,
      applicationInfo: overrides?.applicationInfo,
      storageService: overrides?.storageService,
    });
    await provider.init();
    return provider;
  },
});

export const setupStrategies = (web3: Web3, strategies: Strategy[], overrides?: SetupUniLoginOverrides) => {
  const provider = web3.currentProvider;
  return strategies.map(strategy => {
    switch (strategy) {
      case 'UniLogin':
        return setupUniLogin(web3, overrides);
      case 'Metamask':
        const defaultStrategy: Web3ProviderFactory = {icon: MetamaskLogo, name: 'Metamask', create: () => provider};
        return defaultStrategy;
      default:
        return strategy;
    }
  });
};
