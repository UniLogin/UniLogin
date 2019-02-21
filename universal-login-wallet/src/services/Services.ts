import React from 'react';
import UniversalLoginSDK from 'universal-login-sdk';
import {IdentitySelectionService, SuggestionsService} from 'universal-login-commons';
import ModalService from './ModalService';
import UserWalletService from './UserWalletService';
import CreationSerivce from './Creation';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
}

export const createServices = (config: Config) => {
  const sdk = new UniversalLoginSDK(config.relayerUrl, config.jsonRpcUrl);
  const identitySelectionService = new IdentitySelectionService(sdk, config.domains);
  const suggestionsService = new SuggestionsService(identitySelectionService);
  const modalService = new ModalService();
  const userWalletService = new UserWalletService();
  const creation = CreationSerivce(sdk, userWalletService);
  return {
    sdk,
    suggestionsService,
    identitySelectionService,
    modalService,
    userWalletService
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
