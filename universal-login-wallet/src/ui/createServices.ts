import React from 'react';
import {providers} from 'ethers';
import {walletFromBrain, DeepPartial} from '@universal-login/commons';
import UniversalLoginSDK, {SdkConfig, WalletService} from '@universal-login/sdk';
import {StorageService, WalletStorageService} from '@universal-login/react';
import UserDropdownService from '../app/UserDropdownService';
import WalletPresenter from '../core/presenters/WalletPresenter';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
  saiTokenAddress?: string;
}

interface Overrides {
  provider?: providers.Provider;
  storageService?: StorageService;
  sdkConfig?: DeepPartial<SdkConfig>;
}

export const createServices = (config: Config, overrides: Overrides = {}) => {
  const sdkConfig = {
    ...overrides.sdkConfig,
    applicationInfo: {
      applicationName: 'Jarvis',
      logo: 'https://universal-login-mainnet.netlify.com/logo.ico',
    },
    paymentOptions: {},
    observedTokensAddresses: config.tokens,
    saiTokenAddress: config.saiTokenAddress,
  };
  const providerOrProviderUrl = overrides.provider ? overrides.provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(
    config.relayerUrl,
    providerOrProviderUrl,
    sdkConfig,
  );
  const userDropdownService = new UserDropdownService();
  const storageService = overrides.storageService || new StorageService();
  const walletStorageService = new WalletStorageService(storageService);
  const walletService = new WalletService(sdk, walletFromBrain, walletStorageService);
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
