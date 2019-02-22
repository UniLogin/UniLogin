import React from 'react';
import UniversalLoginSDK from 'universal-login-sdk';
import {IdentitySelectionService, SuggestionsService} from 'universal-login-commons';
import {EventEmitter} from 'fbemitter';
import ModalService from './ModalService';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
}

export const createServices = (config: Config) => {
  const sdk = new UniversalLoginSDK(config.relayerUrl, config.jsonRpcUrl);
  const identitySelectionService = new IdentitySelectionService(sdk, config.domains);
  const suggestionsService = new SuggestionsService(identitySelectionService);
  const emitter = new EventEmitter();
  const modalService = new ModalService();
  return {
    sdk,
    suggestionsService,
    identitySelectionService,
    emitter,
    modalService
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
