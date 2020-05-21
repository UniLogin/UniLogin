import dotenv from 'dotenv';
dotenv.config();
import {getEnv, UNIVERSAL_LOGIN_LOGO_URL, ETHER_NATIVE_TOKEN, NodeEnv, asNodeEnv, DEV_DAI_ADDRESS} from '@unilogin/commons';
import path from 'path';
import {baseConfig} from './baseConfig';
import {cast} from '@restless/sanitizers';

const getDatabaseForGanacheConfig = (env: NodeEnv) => {
  switch (env) {
    case 'test':
      return {
        client: 'postgresql',
        connection: {
          database: 'universal_login_relayer_test',
          user: 'postgres',
          password: 'postgres',
        },
        migrations: {
          tableName: 'knex_migrations',
          directory: path.join(__dirname, '../integration/sql/migrations'),
          loadExtensions: ['.js'],
        },
      };
    case 'development':
      return {
        client: 'postgresql',
        connection: {
          database: 'universal_login_relayer_development',
          user: 'postgres',
          password: 'postgres',
        },
        migrations: {
          tableName: 'knex_migrations',
          directory: path.join(__dirname, '../integration/sql/migrations'),
          loadExtensions: ['.js'],
        },
      };
    default:
      throw TypeError('Invalid environment');
  }
};

export const getConfig = () => ({
  ...baseConfig,
  network: 'ganache',
  jsonRpcUrl: 'http://localhost:18545',
  port: '3311',
  privateKey: '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797',
  ensAddress: '0x67AC97e1088C332cBc7a7a9bAd8a4f7196D5a1Ce',
  ensRegistrars: ['mylogin.eth', 'universal-id.eth', 'popularapp.eth'],
  ensRegistrar: '0xa869372Cfcd5c59D65459973861363BbA45D7F86',
  fallbackHandlerAddress: '0xD3C4A8F56538e07Be4522D20A6410c2c4e4B26a6',
  walletContractAddress: '0x0E2365e86A50377c567E1a62CA473656f0029F1e',
  factoryAddress: '0x915fB4bF4C23a3DEC36C140a7E73dCF85C6D9e22',
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
  database: getDatabaseForGanacheConfig(cast(getEnv('NODE_ENV', 'development'), asNodeEnv)),
  supportedTokens: [{
    address: ETHER_NATIVE_TOKEN.address,
  },
  {
    address: DEV_DAI_ADDRESS,
  }],
});
