import {Provider} from 'web3/providers';
import {Network} from '@unilogin/commons';
import {SdkConfig} from '@unilogin/sdk';
import {BrowserChecker} from '@unilogin/react';
import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {getConfigForNetwork} from '../config';
import {ULWeb3Provider} from '../ULWeb3Provider';
import UniLoginLogo from '../ui/assets/U.svg';
import MetamaskLogo from '../ui/assets/MetaMaskLogoTitle.svg';
import {getNetworkId} from '../utils/getNetworkId';

export interface SetupUniLoginOverrides {
  sdkConfig?: Partial<SdkConfig>;
  browserChecker?: BrowserChecker;
  disabledDialogs?: string[];
}

export const setupUniLogin = (provider: Provider, overrides?: SetupUniLoginOverrides) => ({
  name: 'UniLogin',
  icon: UniLoginLogo,
  create: async () => {
    const networkVersion = await getNetworkId(provider) as Network;
    const uniLoginConfig = getConfigForNetwork(networkVersion);
    return new ULWeb3Provider({
      ...uniLoginConfig,
      disabledDialogs: overrides?.disabledDialogs,
      sdkConfigOverrides: overrides?.sdkConfig,
      browserChecker: overrides?.browserChecker,
    });
  },
});

export type Strategy = 'UniLogin' | 'Metamask' | Web3ProviderFactory;

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
