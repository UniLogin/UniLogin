import React from 'react';
import {providers} from 'ethers';
import {walletFromBrain, DeepPartial} from '@universal-login/commons';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {StorageService, WalletStorageService} from '@universal-login/react';
import UserDropdownService from '../core/app/UserDropdownService';
import connectToWallet from '../core/services/ConnectToWallet';
import WalletPresenter from '../core/presenters/WalletPresenter';
import {ConfigService} from '../core/services/ConfigService';
import {SdkConfig} from '@universal-login/sdk/dist/lib/config/SdkConfig';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
}

interface Overrides {
  provider?: providers.Provider;
  storageService?: StorageService;
  sdkConfig?: DeepPartial<SdkConfig>;
}

export const createServices = (config: Config, overrides: Overrides = {}) => {
  const sdkConfig = {
    ...overrides.sdkConfig,
    applicationName: 'Jarvis',
    paymentOptions: {},
    observedTokensAddresses: config.tokens
  };
  const providerOrProviderUrl = overrides.provider ? overrides.provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(
    config.relayerUrl,
    providerOrProviderUrl,
    sdkConfig
  );
  const userDropdownService = new UserDropdownService();
  const storageService = overrides.storageService || new StorageService();
  const walletStorageService = new WalletStorageService(storageService);
  const walletService = new WalletService(sdk, walletFromBrain, walletStorageService);
  const walletPresenter = new WalletPresenter(walletService);
  const configService = new ConfigService(sdk);
  const _connectToWallet = connectToWallet(sdk, walletService);
  sdk.featureFlagsService.enableAll(new URLSearchParams(window.location.search).getAll('feature'));
  return {
    sdk,
    config,
    userDropdownService,
    connectToWallet: _connectToWallet,
    walletService,
    walletPresenter,
    configService,
    start: () => sdk.start(),
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
