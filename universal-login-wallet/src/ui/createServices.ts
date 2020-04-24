import React from 'react';
import {providers} from 'ethers';
import {walletFromBrain, DeepPartial, Network, DeviceType} from '@unilogin/commons';
import UniversalLoginSDK, {SdkConfig, WalletService} from '@unilogin/sdk';
import {StorageService} from '@unilogin/react';
import WalletPresenter from '../core/presenters/WalletPresenter';

export interface Config {
  network: Network;
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
  rampApiKey?: string;
}

export interface Overrides {
  provider?: providers.Provider;
  storageService?: StorageService;
  sdkConfig?: DeepPartial<SdkConfig>;
}

const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') {return 'unknown';}
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width <= 512 || height <= 512) {
    return 'phone';
  } else if (width <= 1024) {
    return 'tablet';
  }
  return 'laptop';
};

export const createServices = (config: Config, overrides: Overrides = {}) => {
  const storageService = overrides.storageService || new StorageService();
  const sdkConfig = {
    ...overrides.sdkConfig,
    network: config.network,
    applicationInfo: {
      applicationName: 'Jarvis',
      logo: 'https://beta.jarvis.network/logo.ico',
      type: getDeviceType(),
    },
    paymentOptions: {},
    observedTokensAddresses: config.tokens,
    storageService,
    rampApiKey: config.rampApiKey,
  };
  const providerOrProviderUrl = overrides.provider ? overrides.provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(
    config.relayerUrl,
    providerOrProviderUrl,
    sdkConfig,
  );
  const walletService = new WalletService(sdk, walletFromBrain, storageService);
  const walletPresenter = new WalletPresenter(walletService);
  sdk.featureFlagsService.enableAll(new URLSearchParams(window.location.search).getAll('feature'));
  return {
    sdk,
    config,
    walletService,
    storageService,
    walletPresenter,
    start: () => sdk.start(),
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
