import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {providers} from 'ethers';
import {Config} from '../../config/types';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

export interface Overrides {
  provider?: providers.Provider;
}

export const createServices = (config: Config, {provider}: Overrides = {}) => {
  const providerOrProviderUrl = provider || config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(config.relayerUrl, providerOrProviderUrl, {applicationInfo: {type: 'laptop'}, observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0x915fB4bF4C23a3DEC36C140a7E73dCF85C6D9e22']});
  sdk.featureFlagsService.enableAll(new URLSearchParams(window.location.search).getAll('feature'));
  return {
    sdk,
    config,
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
