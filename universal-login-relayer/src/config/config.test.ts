import path from 'path';
import {Config} from './relayer';
import {UNIVERSAL_LOGIN_LOGO_URL, MAX_GAS_LIMIT} from '@unilogin/commons';

export const config: Config = Object.freeze({
  port: 'GENERATED',
  privateKey: 'GENERATED',
  network: 'ganache',
  ensAddress: 'GENERATED',
  ensRegistrars: ['GENERATED'],
  ensRegistrar: 'GENERATED',
  fallbackHandlerAddress: 'GENERATED',
  walletContractAddress: 'GENERATED',
  contractWhiteList: {
    proxy: ['GENERATED'],
    wallet: ['GENERATED'],
  },
  factoryAddress: 'GENERATED',
  supportedTokens: [{
    address: 'GENERATED',
  }],
  localization: {
    language: 'en',
    country: 'any',
  },
  onRampProviders: {
    safello: {
      appId: '1234-5678',
      baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
      addressHelper: true,
    },
    ramp: {
      appName: 'Universal Login',
      logoUrl: UNIVERSAL_LOGIN_LOGO_URL,
      rampUrl: 'https://ri-widget-staging.firebaseapp.com/',
    },
    wyre: {
      wyreUrl: 'https://pay.sendwyre.com/purchase',
    },
  },
  database: {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_test',
      user: 'postgres',
      password: 'postgres',
    },
    migrations: {
      directory: path.join(__dirname, '../integration/sql/migrations'),
      loadExtensions: ['.js'],
    },
  },
  maxGasLimit: MAX_GAS_LIMIT,
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
  httpsRedirect: false,
});

export default config;
