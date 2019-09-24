import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {providers} from 'ethers';
import {Config} from '../../config/types';
import {IPGeolocationService} from '../../integration/http/IPGeolocationService';

export interface Overrides {
  provider?: providers.Provider;
}

export const createServices = (config: Config, {provider} : Overrides = {}) => {
  const providerOrProviderUrl = provider ? provider : config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(config.relayerUrl, providerOrProviderUrl);
  const ipGeolocationService = new IPGeolocationService(config.ipGeolocationApi.baseUrl, config.ipGeolocationApi.accessKey);
  return {
    sdk,
    ipGeolocationService,
    config
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
