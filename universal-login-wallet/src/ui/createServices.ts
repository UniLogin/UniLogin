import React from 'react';
import {providers} from 'ethers';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import UserDropdownService from '../core/app/UserDropdownService';
import connectToWallet from '../core/services/ConnectToWallet';
import WalletPresenter from '../core/presenters/WalletPresenter';
import {StorageService} from '../core/services/StorageService';
import {WalletStorageService} from '../core/services/WalletStorageService';
import {walletFromBrain} from '@universal-login/commons';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
}

interface Overrides {
  provider?: providers.Provider;
  storageService?: StorageService;
}

export const createServices = (config: Config, overrides : Overrides = {}) => {
  const providerOrProviderUrl = overrides.provider ? overrides.provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(
    config.relayerUrl,
    providerOrProviderUrl,
    {
      paymentOptions: {},
      observedTokensAddresses: config.tokens
    }
  );
  const userDropdownService = new UserDropdownService();
  const storageService = overrides.storageService || new StorageService();
  const walletStorageService = new WalletStorageService(storageService);
  const walletService = new WalletService(sdk, walletFromBrain, walletStorageService);
  const walletPresenter = new WalletPresenter(walletService);
  const _connectToWallet = connectToWallet(sdk, walletService);
  return {
    sdk,
    config,
    userDropdownService,
    connectToWallet: _connectToWallet,
    walletService,
    walletPresenter,
    start: () => sdk.start(),
    getRelayerConfig: () => sdk.getRelayerConfig()
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
