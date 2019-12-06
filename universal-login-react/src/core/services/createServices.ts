import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {providers} from 'ethers';
import {Config} from '../../config/types';
import {ULWeb3Provider} from '@universal-login/web3';
import Web3 from 'web3';

export interface Overrides {
  provider?: providers.Provider;
}

export const createServices = (config: Config, {provider}: Overrides = {}) => {
  const providerOrProviderUrl = provider || config.jsonRpcUrl;
  const sdk = new UniversalLoginSDK(config.relayerUrl, providerOrProviderUrl, {applicationInfo: {type: 'laptop'}, observedTokensAddresses: config.tokens, saiTokenAddress: config.saiTokenAddress});
  const ulWeb3 = ULWeb3Provider.getDefaultProvider({
    relayerUrl: config.relayerUrl,
    ensDomains: config.domains,
    provider: new Web3.providers.HttpProvider(config.jsonRpcUrl),
  });
  const web3 = new Web3(ulWeb3 as any);
  sdk.featureFlagsService.enableAll(new URLSearchParams(window.location.search).getAll('feature'));
  return {
    ulWeb3,
    web3,
    sdk,
    config,
  };
};

export type Services = ReturnType<typeof createServices>;

export const ServiceContext = React.createContext({} as Services);
