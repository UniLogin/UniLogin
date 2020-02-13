import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {Strategy, UniLogin} from './UniLogin';
import {ApplicationInfo} from '@universal-login/commons';
import {StorageService} from '@universal-login/react';
import UniLoginLogo from '../ui/assets/U.svg';
import MetamaskLogo from '../ui/assets/MetaMaskLogoTitle.svg';
import {Provider} from 'web3/providers';

export interface SetupUniLoginOverrides {
  applicationInfo?: ApplicationInfo;
  storageService?: StorageService;
}

export const setupUniLogin = (provider: Provider, overrides?: SetupUniLoginOverrides) => ({
  name: 'UniLogin',
  icon: UniLoginLogo,
  create: () => UniLogin.createULProvider(provider, overrides),
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
