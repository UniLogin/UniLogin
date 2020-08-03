import dotenv from 'dotenv';
dotenv.config();
import {getEnv, DAI_KOVAN, UNIVERSAL_LOGIN_LOGO_URL, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import path from 'path';
import {baseConfig} from './baseConfig';

export const getConfig = () => ({
  ...baseConfig,
  network: 'kovan',
  jsonRpcUrl: `https://kovan.infura.io/v3/${getEnv('INFURA_API_KEY', '')}`,
  ensAddress: '0x4Ca9B09FE1CDC2C4b0B489b6f92b24fd27feBB40',
  ensRegistrars: ['unilogin.test', 'poppularapp.test'],
  ensRegistrar: '0xD79721fD1c007320cB443D4F7026b5B06f68ff97',
  fallbackHandlerAddress: '0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44',
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
      wyreUrl: 'https://pay.testwyre.com/purchase',
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
  supportedTokens: [{
    address: ETHER_NATIVE_TOKEN.address,
  },
  {
    address: DAI_KOVAN,
  }],
});
