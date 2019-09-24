import {ContractWhiteList, SupportedToken, ChainSpec, LocalizationConfig, OnRampConfig} from '@universal-login/commons';
import {KnexConfig} from './KnexConfig';

export interface Config {
  jsonRpcUrl?: string;
  port?: string;
  privateKey: string;
  chainSpec: ChainSpec;
  ensRegistrars: string[];
  walletContractAddress: string;
  contractWhiteList: ContractWhiteList;
  factoryAddress: string;
  supportedTokens: SupportedToken[];
  localization: LocalizationConfig;
  onRampProviders: OnRampConfig;
  database: KnexConfig;
  maxGasLimit: number;
}
