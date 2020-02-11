import React from 'react';
import {providers} from 'ethers';
import {walletFromBrain, DeepPartial} from '@universal-login/commons';
import UniversalLoginSDK, {SdkConfig, WalletService} from '@universal-login/sdk';
import {StorageService} from '@universal-login/react';
import UserDropdownService from '../app/UserDropdownService';
import WalletPresenter from '../core/presenters/WalletPresenter';

export interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
  saiTokenAddress?: string;
}

export interface Overrides {
  provider?: providers.Provider;
  storageService?: StorageService;
  sdkConfig?: DeepPartial<SdkConfig>;
}

export const createServices = (config: Config, overrides: Overrides = {}) => {
  const storageService = overrides.storageService || new StorageService();
  const sdkConfig = {
    ...overrides.sdkConfig,
    applicationInfo: {
      applicationName: 'Jarvis',
      logo: 'https://universal-login-mainnet.netlify.com/logo.ico',
    },
    paymentOptions: {},
    observedTokensAddresses: config.tokens,
    saiTokenAddress: config.saiTokenAddress,
    storageService,
  };
  const providerOrProviderUrl = overrides.provider ? overrides.provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(
    config.relayerUrl,
    providerOrProviderUrl,
    sdkConfig,
  );
  const userDropdownService = new UserDropdownService();
  const walletService = new WalletService(sdk, walletFromBrain, storageService);
  const walletPresenter = new WalletPresenter(walletService);
  sdk.featureFlagsService.enableAll(new URLSearchParams(window.location.search).getAll('feature'));
  return {
    sdk,
    config,
    userDropdownService,
    walletService,
    storageService,
    walletPresenter,
    start: () => sdk.start(),
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
