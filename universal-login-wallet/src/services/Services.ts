import React from 'react';
import UniversalLoginSDK from 'universal-login-sdk';
import {WalletSelectionService, SuggestionsService} from 'universal-login-commons';
import ModalService from './ModalService';
import UserDropdownService from './UserDropdownService';
import WalletService from './WalletService';
import createWallet from './Creation';
import connectToWallet from './ConnectToWallet';
import TransferService from './TransferService';
import TokenService from './TokenService';
import {EtherBalanceService} from './balance/EtherBalanceService';
import {BalanceService} from './balance/BalanceService';
import {providers} from 'ethers';

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
  const walletSelectionService = new WalletSelectionService(sdk, config.domains);
  const suggestionsService = new SuggestionsService(walletSelectionService);
  const modalService = new ModalService();
  const userDropdownService = new UserDropdownService();
  const walletService = new WalletService();
  const _connectToWallet = connectToWallet(sdk, walletService);
  const _createWallet = createWallet(sdk, walletService);
  const tokenService = new TokenService(config.tokens, sdk.provider);
  const transferService = new TransferService(sdk, walletService, tokenService);
  const etherBalanceService = new EtherBalanceService(sdk.provider, walletService);
  const balanceService = new BalanceService(etherBalanceService);
  return {
    sdk,
    suggestionsService,
    walletSelectionService,
    modalService,
    userDropdownService,
    createWallet: _createWallet,
    connectToWallet: _connectToWallet,
    walletService,
    tokenService,
    transferService,
    balanceService
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
