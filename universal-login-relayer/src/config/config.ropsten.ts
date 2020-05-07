import dotenv from 'dotenv';
dotenv.config();
import {getEnv, UNIVERSAL_LOGIN_LOGO_URL} from '@unilogin/commons';
import path from 'path';
import {baseConfig} from './baseConfig';

export const getConfig = () => ({
  ...baseConfig,
  jsonRpcUrl: `https://ropsten.infura.io/v3/${getEnv('INFURA_API_KEY', '')}`,
  network: 'ropsten',
  ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  ensRegistrars: ['unilogin.test'],
  ensRegistrar: '0x223cE85C5A77086e4f0EAb59286c58299A7616B1',
  fallbackHandlerAddress: '0x414cDd8702Eeb7de39D8369fea2C32291ACeB9ae',
  walletContractAddress: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
  factoryAddress: '0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B',
  onRampProviders: {
    safello: {
      appId: getEnv('SAFELLO_APP_ID', ''),
      baseAddress: getEnv('SAFELLO_URL', ''),
      addressHelper: true,
    },
    ramp: {
      appName: 'Universal Login',
      logoUrl: UNIVERSAL_LOGIN_LOGO_URL,
      rampUrl: getEnv('RAMP_URL', ''),
      rampApiKey: getEnv('RAMP_API_KEY', ''),
    },
    wyre: {
      wyreUrl: 'https://pay.sendwyre.com/purchase',
    },
  },
  database: {
    client: 'postgresql',
    connection: getEnv('DATABASE_URL', ''),
    migrations: {
      directory: path.join(__dirname, '../integration/sql/migrations'),
      loadExtensions: ['.js'],
    },
  },
});
