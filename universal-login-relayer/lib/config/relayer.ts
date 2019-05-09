import dotenv from 'dotenv';
import { getEnv } from '@universal-login/commons';

dotenv.config();

export interface Config {
  legacyENS: boolean;
  jsonRpcUrl?: string;
  port?: string;
  privateKey: string;
  chainSpec: {
    ensAddress: string,
    chainId: number,
    name: string,
  };
  ensRegistrars: string[];
  walletMasterAddress?: string;
}

const config: Config =  Object.freeze({
  legacyENS: true,
  jsonRpcUrl: getEnv('JSON_RPC_URL'),
  port: getEnv('PORT', ''),
  privateKey: getEnv('PRIVATE_KEY'),
  chainSpec: Object.freeze({
    ensAddress: getEnv('ENS_ADDRESS'),
    chainId: 0,
    name: 'ganache'
  }),
  ensRegistrars: [
    getEnv('ENS_DOMAIN_1', ''),
    getEnv('ENS_DOMAIN_2', ''),
    getEnv('ENS_DOMAIN_3', ''),
  ],
});

export default config;