import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelectionService, SuggestionsService} from '@universal-login/commons';
import ModalService from './ModalService';
import UserDropdownService from '../services/UserDropdownService';
import WalletService from '../services/WalletService';
import createWallet from '../services/Creation';
import connectToWallet from '../core/ConnectToWallet';
import TransferService from '../services/TransferService';
import NotificationsService from '../services/Notifications';
import TokenService from '../services/TokenService';
import {EtherBalanceService} from '../services/balance/EtherBalanceService';
import {BalanceService} from '../services/balance/BalanceService';
import {providers} from 'ethers';
import WalletFormatter from '../services/utils/WalletFormatter';

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
  const walletService = new WalletService(sdk);
  const walletFormatter = new WalletFormatter(walletService);
  const _connectToWallet = connectToWallet(sdk, walletService);
  const _createWallet = createWallet(sdk, walletService);
  const tokenService = new TokenService(config.tokens, sdk.provider);
  const transferService = new TransferService(sdk, walletService, tokenService);
  const etherBalanceService = new EtherBalanceService(sdk.provider, walletService);
  const balanceService = new BalanceService(etherBalanceService);
  const notificationService = new NotificationsService(sdk, walletService);
  return {
    sdk,
    suggestionsService,
    walletSelectionService,
    modalService,
    userDropdownService,
    createWallet: _createWallet,
    connectToWallet: _connectToWallet,
    walletService,
    walletFormatter,
    tokenService,
    transferService,
    balanceService,
    notificationService
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
