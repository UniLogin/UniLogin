import {createServices} from '../../../src/ui/createServices';
import {providers} from 'ethers';
import {testJsonRpcUrl, TEST_SDK_CONFIG} from '@universal-login/commons';
import {MemoryStorageService} from '@universal-login/react';
import {SdkConfig} from '@universal-login/sdk/dist/lib/config/SdkConfig';

export const createPreconfiguredServices = async (provider: providers.Provider, relayer: any, tokens: string[]) => {
  const domains = relayer.config.ensRegistrars;
  const config = {
    jsonRpcUrl: testJsonRpcUrl,
    relayerUrl: relayer.url(),
    domains,
    tokens,
  };
  const storageService = new MemoryStorageService();
  const sdkConfig = TEST_SDK_CONFIG as SdkConfig;
  const services = createServices(config, {provider, storageService, sdkConfig});
  services.sdk.priceObserver.getCurrentPrices = () => {
    return Promise.resolve({ETH: {USD: 1, DAI: 1, ETH: 1}});
  };
  return services;
};
