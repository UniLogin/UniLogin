import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import UserDropdownService from '../core/app/UserDropdownService';
import connectToWallet from '../core/services/ConnectToWallet';
import TransferService from '../integration/ethereum/TransferService';
import TokenService from '../integration/ethereum/TokenService';
import {EtherBalanceService} from '../integration/ethereum/EtherBalanceService';
import {BalanceService} from '../core/services/BalanceService';
import {providers} from 'ethers';
import WalletPresenter from '../core/presenters/WalletPresenter';

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
  const sdk = new UniversalLoginSDK(config.relayerUrl, providerOrProviderUrl);
  const userDropdownService = new UserDropdownService();
  const walletService = new WalletService(sdk);
  const walletPresenter = new WalletPresenter(walletService);
  const _connectToWallet = connectToWallet(sdk, walletService);
  const tokenService = new TokenService(config.tokens, sdk.provider);
  const transferService = new TransferService(sdk, walletService, tokenService);
  const etherBalanceService = new EtherBalanceService(sdk.provider, walletService);
  const balanceService = new BalanceService(etherBalanceService);
  return {
    sdk,
    config,
    userDropdownService,
    connectToWallet: _connectToWallet,
    walletService,
    walletPresenter,
    tokenService,
    transferService,
    balanceService,
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
