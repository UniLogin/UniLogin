import React from 'react';
import UniversalLoginSDK from 'universal-login-sdk';
import {IdentitySelectionService, SuggestionsService} from 'universal-login-commons';
import ModalService from './ModalService';
import WalletService from './WalletService';
import createWallet from './Creation';
import TransferService from './TransferService';
import TokenService from './TokenService';
import {providers} from 'ethers';
interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
}

export const createServices = (config: Config, provider?: providers.Provider) => {
  const providerOrProviderUrl = provider ? provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(config.relayerUrl, providerOrProviderUrl);
  const identitySelectionService = new IdentitySelectionService(sdk, config.domains);
  const suggestionsService = new SuggestionsService(identitySelectionService);
  const modalService = new ModalService();
  const walletService = new WalletService();
  const _createWallet = createWallet(sdk, walletService);
  const tokenService = new TokenService(config.tokens, sdk.provider);
  const transferService = new TransferService(sdk, walletService, tokenService);
  return {
    sdk,
    suggestionsService,
    identitySelectionService,
    modalService,
    createWallet: _createWallet,
    walletService,
    tokenService,
    transferService
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
