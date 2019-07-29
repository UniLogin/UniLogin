import dotenv from 'dotenv';
import {ContractWhiteList, SupportedToken, ChainSpec, LocalizationConfig, SafelloConfig, getEnv} from '@universal-login/commons';
import {KnexConfig} from './KnexConfig';
import testConfig from './config.test';
import devConfig from './config.dev';
import prodConfig from './config.prod';

dotenv.config();

export interface Config {
  jsonRpcUrl?: string;
  port?: string;
  privateKey: string;
  chainSpec: ChainSpec;
  ensRegistrars: string[];
  walletMasterAddress: string;
  contractWhiteList: ContractWhiteList;
  factoryAddress: string;
  supportedTokens: SupportedToken[];
  localization: LocalizationConfig;
  onRampProviders: {
    safello: SafelloConfig;
  };
  database: KnexConfig;
}

const getNodeEnv = () => getEnv('NODE_ENV', 'development');

export function getConfig(environment: string = getNodeEnv()) {
  switch (environment) {
    case 'production':
      return prodConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return devConfig;
  }
}
