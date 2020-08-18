import {ContractWhiteList, SupportedToken, LocalizationConfig, OnRampConfig, IPGeolocationApiConfig, Network} from '@unilogin/commons';
import {KnexConfig} from './KnexConfig';
import {getConfig as getGanacheConfig} from './config.ganache';
import {getConfig as getKovanConfig} from './config.kovan';
import {getConfig as getMainnetConfig} from './config.mainnet';
import {getConfig as getRinkebyConfig} from './config.rinkeby';
import {getConfig as getRopstenConfig} from './config.ropsten';

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
  email: EmailConfig;
  codeExpirationTimeInMinutes: number;
}

export interface EmailConfig {
  from: string;
  apiKey: string;
  emailLogo: string;
  copyToClipboardUrl: string;
}

export function getConfigForNetwork(network: Network): Config {
  switch (network) {
    case '1':
    case 'mainnet':
      return getMainnetConfig();
    case '3':
    case 'ropsten':
      return getRopstenConfig();
    case '4':
    case 'rinkeby':
      return getRinkebyConfig();
    case '42':
    case 'kovan':
      return getKovanConfig();
    case '8545':
    case 'ganache':
      return getGanacheConfig();
    default:
      throw new Error(`Invalid network: ${network}`);
  }
}
