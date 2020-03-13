import {IPGeolocationApiConfig, Network} from '@unilogin/commons';

export interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
  saiTokenAddress?: string;
  ipGeolocationApi: IPGeolocationApiConfig;
  network: Network;
}
