import {ContractWhiteList, SupportedToken, ChainSpec, LocalizationConfig, SafelloConfig} from '@universal-login/commons';
import {KnexConfig} from './KnexConfig';

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
