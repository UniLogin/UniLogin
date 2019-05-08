import dotenv from 'dotenv';
import { getEnv } from './getEnv';
dotenv.config();

const config =  Object.freeze({
  legacyENS: true,
  jsonRpcUrl: getEnv('JSON_RPC_URL'),
  port: getEnv('PORT', ''),
  privateKey: getEnv('PRIVATE_KEY'),
  chainSpec: Object.freeze({
    ensAddress: getEnv('ENS_ADDRESS'),
    chainId: 0,
  }),
  ensRegistrars: [
    getEnv('ENS_DOMAIN_1', ''),
    getEnv('ENS_DOMAIN_2', ''),
    getEnv('ENS_DOMAIN_3', ''),
  ],
});

export default config;