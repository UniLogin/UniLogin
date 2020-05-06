import {ContractWhiteList, SupportedToken, LocalizationConfig, OnRampConfig, IPGeolocationApiConfig, Network} from '@unilogin/commons';
import {KnexConfig} from './KnexConfig';
import {config as configGanache} from './config.ganache';
import {config as configKovan} from './config.kovan';
import {config as configMainnet} from './config.mainnet';
import {config as configRinkeby} from './config.rinkeby';
import {config as configRopsten} from './config.ropsten';

export interface Config {
  jsonRpcUrl?: string;
  port?: string;
  privateKey: string;
  ensAddress: string;
  network: string;
  ensRegistrars: string[];
  ensRegistrar: string;
  fallbackHandlerAddress: string;
  walletContractAddress: string;
  contractWhiteList: ContractWhiteList;
  factoryAddress: string;
  supportedTokens: SupportedToken[];
  localization: LocalizationConfig;
  onRampProviders: OnRampConfig;
  database: KnexConfig;
  maxGasLimit: number;
  ipGeolocationApi: IPGeolocationApiConfig;
  httpsRedirect: boolean;
}

export function getConfigForNetwork(network: Network): Config {
  switch (network) {
    case '1':
    case 'mainnet':
      return configMainnet;
    case '3':
    case 'ropsten':
      return configRopsten;
    case '4':
    case 'rinkeby':
      return configRinkeby;
    case '42':
    case 'kovan':
      return configKovan;
    case '8545':
    case 'ganache':
      return configGanache;
    default:
      throw new Error(`Invalid network: ${network}`);
  }
}
