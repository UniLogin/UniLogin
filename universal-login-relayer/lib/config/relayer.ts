import dotenv from 'dotenv';
import {getEnv, ContractWhiteList, SupportedToken, ChainSpec, ETHER_NATIVE_TOKEN, LocalizationConfig, SafelloConfig} from '@universal-login/commons';
import {utils} from 'ethers';

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
    proxy: ['0x70aa6ef04860e3effad48a2e513965ff76c08c96b7586dfd9e01d4da08e00ccb']
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
  }
});

export default config;
