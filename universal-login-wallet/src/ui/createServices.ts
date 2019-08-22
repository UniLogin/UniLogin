import React from 'react';
import {providers} from 'ethers';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import UserDropdownService from '../core/app/UserDropdownService';
import connectToWallet from '../core/services/ConnectToWallet';
import WalletPresenter from '../core/presenters/WalletPresenter';
import { StorageService } from '../core/services/StorageService';
import { WalletStorageService } from '../core/services/WalletStorageService';

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
      observedTokens: config.tokens.map((address: string) => ({address}))
    }
  );
  const userDropdownService = new UserDropdownService();
  const walletService = new WalletService(sdk);
  const walletPresenter = new WalletPresenter(walletService);
  const _connectToWallet = connectToWallet(sdk, walletService);
  const walletStorageService = new WalletStorageService(walletService, storageService);
  const storageService = new StorageService();
  
  return {
    sdk,
    config,
    userDropdownService,
    connectToWallet: _connectToWallet,
    walletService,
    walletPresenter,
    start: () => sdk.start()
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
