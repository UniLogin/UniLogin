import dotenv from 'dotenv';
import {getEnv, ContractWhiteList, SupportedToken, ChainSpec, ETHER_NATIVE_TOKEN, LocalizationConfig, SafelloConfig} from '@universal-login/commons';
import {utils} from 'ethers';
import {KnexConfig} from './KnexConfig';
import {getKnexConfig} from '../core/utils/knexUtils';

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
  knexConfig: KnexConfig;
}

export const config: Config =  Object.freeze({
  jsonRpcUrl: getEnv('JSON_RPC_URL', ''),
  port: getEnv('PORT', ''),
  privateKey: getEnv('PRIVATE_KEY', ''),
  chainSpec: Object.freeze({
    ensAddress: getEnv('ENS_ADDRESS', ''),
    chainId: 0,
    name: 'ganache'
  }),
  ensRegistrars: [
    getEnv('ENS_DOMAIN_1', ''),
    getEnv('ENS_DOMAIN_2', ''),
    getEnv('ENS_DOMAIN_3', ''),
  ],
  walletMasterAddress: getEnv('WALLET_MASTER_ADDRESS', ''),
  contractWhiteList: {
    master: [],
    proxy: ['0xca33d06bff615ad98056f8f720c57042cd3e820985235a3f77b73067c451cd3e']
  },
  factoryAddress: getEnv('FACTORY_ADDRESS', ''),
  supportedTokens: [{
    address: ETHER_NATIVE_TOKEN.address,
    minimalAmount: utils.parseEther('0.005').toString()
  }],
  localization: {
    language: 'en',
    country: 'any'
  },
  onRampProviders: {
    safello: {
      appId: '1234-5678',
      baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
      addressHelper: true
    }
  },
  knexConfig: getKnexConfig(),
});

export default config;
