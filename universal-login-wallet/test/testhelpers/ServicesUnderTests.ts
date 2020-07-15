import {createServices} from '../../src/ui/createServices';
import {providers, utils} from 'ethers';
import {TEST_SDK_CONFIG, TEST_GAS_PRICE} from '@unilogin/commons';
import {SdkConfig, MemoryStorageService} from '@unilogin/sdk';
import getConfig from '../../src/config/getConfig';

export const createPreconfiguredServices = async (provider: providers.JsonRpcProvider, relayer: any, tokens: string[]) => {
  const domains = relayer.config.ensRegistrars;
  const config = {...getConfig(), domains, tokens};
  const storageService = new MemoryStorageService();
  const sdkConfig = TEST_SDK_CONFIG as SdkConfig;
  const services = createServices(config, {provider, storageService, sdkConfig});
  (provider as any).pollingInterval = 10;
  services.sdk.gasPriceOracle.getGasPrices = () => {
    return Promise.resolve({
      cheap: {
        gasPrice: utils.parseUnits('12', 'gwei'),
        timeEstimation: 132,
      },
      fast: {
        gasPrice: utils.bigNumberify(TEST_GAS_PRICE),
        timeEstimation: 12,
      },
    });
  };
  services.sdk.priceObserver.getCurrentPrices = () => {
    return Promise.resolve({
      ETH: {USD: 1, DAI: 1, SAI: 1, ETH: 1},
      DAI: {USD: 1, DAI: 1, SAI: 1, ETH: 1},
    });
  };
  await services.sdk.start();
  return services;
};
