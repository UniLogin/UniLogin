import dotenv from 'dotenv';
dotenv.config();
import {ContractWhiteList, SupportedToken, LocalizationConfig, OnRampConfig, IPGeolocationApiConfig, Network, getEnv, ETHER_NATIVE_TOKEN, UNIVERSAL_LOGIN_LOGO_URL, NodeEnv, getNodeEnv} from '@unilogin/commons';
import {KnexConfig} from './KnexConfig';
import path from 'path';

export interface Config {
  jsonRpcUrl?: string;
  port?: string;
  privateKey: string;
  ensAddress: string;
  network: string;
  ensRegistrars: string[];
  ensRegistrar: string;
  fallbackHandlerAddress: string;
  walletContractAddress: string;
  contractWhiteList: ContractWhiteList;
  factoryAddress: string;
  supportedTokens: SupportedToken[];
  localization: LocalizationConfig;
  onRampProviders: OnRampConfig;
  database: KnexConfig;
  maxGasLimit: number;
  ipGeolocationApi: IPGeolocationApiConfig;
  httpsRedirect: boolean;
}

const baseConfig = {
  supportedTokens: [{
    address: ETHER_NATIVE_TOKEN.address,
  }],
  localization: {
    language: 'en',
    country: 'any',
  },
  maxGasLimit: 500000,
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
  contractWhiteList: {
    wallet: [
      '0x0fc2be641158de5ed5cdbc4cec010c762bc74771e51b15432bb458addac3513d',
      '0x6575c72edecb8ce802c58b1c1b9cbb290ef2b27588b76c73302cb70b862702a7',
      '0x56b8be58b5ad629a621593a2e5e5e8e9a28408dc06e95597497b303902772e45',
    ],
    proxy: [
      '0xb68afa7e9356b755f3d76e981adaa503336f60df29b28c0a8013c17cecb750bb',
      '0xaea7d4252f6245f301e540cfbee27d3a88de543af8e49c5c62405d5499fab7e5',
    ],
  },
  httpsRedirect: getEnv('HTTPS_REDIRECT', '') === 'true',
  port: getEnv('PORT', ''),
  privateKey: getEnv('PRIVATE_KEY', ''),
};

export function getConfigForNetwork(network: Network): Config {
  switch (network) {
    case '1':
    case 'mainnet':
      return {
        ...baseConfig,
        jsonRpcUrl: 'https://mainnet.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d',
        network: 'mainnet',
        ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        ensRegistrars: ['unibeta.eth'],
        ensRegistrar: '0x93C83c499970F9DB8E795aD6b5f68CD137561008',
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
      };
    case '3':
    case 'ropsten':
      return {
        ...baseConfig,
        jsonRpcUrl: 'https://ropsten.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d',
        network: 'ropsten',
        ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        ensRegistrars: ['unilogin.test'],
        ensRegistrar: '0x223cE85C5A77086e4f0EAb59286c58299A7616B1',
        fallbackHandlerAddress: '',
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
      };
    case '4':
    case 'rinkeby':
      return {
        ...baseConfig,
        network: 'rinkeby',
        jsonRpcUrl: 'https://rinkeby.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d',
        ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        ensRegistrars: ['unilogin.test'],
        ensRegistrar: '0x1BA9B86331DDcD63c2AcA7a98886F7e7C2788cD4',
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
      };
    case '42':
    case 'kovan':
      return {
        ...baseConfig,
        network: 'kovan',
        jsonRpcUrl: 'https://kovan.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d',
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
      };
    case '8545':
    case 'ganache':
      return {
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
        database: getDatabaseForGanacheConfig(getNodeEnv()),
        supportedTokens: [{
          address: ETHER_NATIVE_TOKEN.address,
        },
        {
          address: '0xd19Fbe8878507D0Aa9f2F6Acf40Ff6C21d6CecE8',
        }],
      };
    default:
      throw new Error(`Invalid network: ${network}`);
  }
}

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
