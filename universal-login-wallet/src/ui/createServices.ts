import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelectionService, SuggestionsService} from '@universal-login/commons';
import ModalService from '../core/app/ModalService';
import UserDropdownService from '../core/app/UserDropdownService';
import WalletService from '../integration/storage/WalletService';
import connectToWallet from '../core/services/ConnectToWallet';
import TransferService from '../integration/ethereum/TransferService';
import NotificationsService from '../core/services/Notifications';
import TokenService from '../integration/ethereum/TokenService';
import {EtherBalanceService} from '../integration/ethereum/EtherBalanceService';
import {BalanceService} from '../core/services/BalanceService';
import {providers} from 'ethers';
import WalletFormatter from '../core/utils/WalletFormatter';

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
