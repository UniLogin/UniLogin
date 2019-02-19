import React from 'react';
import UniversalLoginSDK from 'universal-login-sdk';
import {IdentitySelectionService, SuggestionsService} from 'universal-login-commons';
import ModalService from './ModalService';
import IdentityService from './IdentityService';

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
  const identityService = new IdentityService();
  return {
    sdk,
    suggestionsService,
    identitySelectionService,
    modalService,
    identityService
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
