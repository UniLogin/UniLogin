import React from 'react';
import {providers} from 'ethers';
import {TokenDetailsService} from '@universal-login/commons';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import UserDropdownService from '../core/app/UserDropdownService';
import connectToWallet from '../core/services/ConnectToWallet';
import {BalanceService} from '../core/services/BalanceService';
import WalletPresenter from '../core/presenters/WalletPresenter';
import {EtherBalanceService} from '../integration/ethereum/EtherBalanceService';
import TransferService from '../integration/ethereum/TransferService';
import TokensDetailsStore from '../integration/ethereum/TokensDetailsStore';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
}

interface Overrides {
  provider?: providers.Provider;
}

export const createServices = (config: Config, {provider} : Overrides = {}) => {
  const providerOrProviderUrl = provider ? provider : config.jsonRpcUrl;
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
  const tokenDetailsService = new TokenDetailsService(sdk.provider);
  const tokensDetailsStore = new TokensDetailsStore(tokenDetailsService, config.tokens);
  const transferService = new TransferService(sdk, walletService, tokensDetailsStore);
  const etherBalanceService = new EtherBalanceService(sdk.provider, walletService);
  const balanceService = new BalanceService(etherBalanceService);
  return {
    sdk,
    config,
    userDropdownService,
    connectToWallet: _connectToWallet,
    walletService,
    walletPresenter,
    tokensDetailsStore,
    transferService,
    balanceService,
    start: () => {
      tokensDetailsStore.fetchTokensDetails();
      balanceService.start();
      sdk.start();
    }
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
