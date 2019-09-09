import path from 'path';
import {getEnv, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {Config} from './relayer';

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
  walletContractAddress: getEnv('WALLET_MASTER_ADDRESS', ''),
  contractWhiteList: {
    wallet: [],
    proxy: ['0xfc8b7148b2866fd89eec60cb9fcc38a8527a090b9219ab243e82b010cda8d3a9']
  },
  factoryAddress: getEnv('FACTORY_ADDRESS', ''),
  supportedTokens: [{
    address: ETHER_NATIVE_TOKEN.address,
    minimalAmount: '500000'
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
    },
    ramp: {
      appName: 'Universal Login',
      logoUrl: 'https://universalloginsdk.readthedocs.io/en/latest/_images/logo.png',
      rampUrl: 'https://ri-widget-staging.firebaseapp.com/'
    }
  },
  database: {
    client: 'postgresql',
    connection: getEnv('DATABASE_URL', ''),
    migrations: {
      directory: path.join(__dirname, '../integration/sql/migrations'),
    }
  },
});

export default config;
