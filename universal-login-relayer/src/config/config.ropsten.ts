import dotenv from 'dotenv';
dotenv.config();
import {getEnv, UNIVERSAL_LOGIN_LOGO_URL} from '@unilogin/commons';
import path from 'path';
import {baseConfig} from './baseConfig';

export const getConfig = () => ({
  ...baseConfig,
  network: 'ropsten',
  jsonRpcUrl: `https://ropsten.infura.io/v3/${getEnv('INFURA_API_KEY', '')}`,
  ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  ensRegistrars: ['unilogin.test'],
  ensRegistrar: '0x223cE85C5A77086e4f0EAb59286c58299A7616B1',
  fallbackHandlerAddress: '0x414cDd8702Eeb7de39D8369fea2C32291ACeB9ae',
  walletContractAddress: '0x689F188296D13F6389eCD83F0d5E1f872beb5c12',
  factoryAddress: '0xB84513258F36F87183ecF42ebe5B85425A32A248',
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
