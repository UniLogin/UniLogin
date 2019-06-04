import dotenv from 'dotenv';
import { getEnv, ContractWhiteList } from '@universal-login/commons';

dotenv.config();

export interface Config {
  jsonRpcUrl?: string;
  port?: string;
  privateKey: string;
  chainSpec: {
    ensAddress: string,
    chainId: number,
    name: string,
  };
  ensRegistrars: string[];
  walletMasterAddress: string;
  contractWhiteList: ContractWhiteList;
}

const config: Config =  Object.freeze({
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
  }
});

export default config;
