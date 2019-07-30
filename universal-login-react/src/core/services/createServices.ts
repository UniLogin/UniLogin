import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {providers} from 'ethers';

export interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
}

export interface Overrides {
  provider?: providers.Provider;
}

export const createServices = (config: Config, {provider} : Overrides = {}) => {
  const providerOrProviderUrl = provider ? provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(config.relayerUrl, providerOrProviderUrl);
  return {
    sdk,
    config
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
