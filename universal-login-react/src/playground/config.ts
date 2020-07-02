import {IPGeolocationApiConfig, Network, DEV_DAI_ADDRESS} from '@unilogin/commons';

export interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
  saiTokenAddress?: string;
  ipGeolocationApi: IPGeolocationApiConfig;
  network: Network;
}

require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';

const tokens = process.env.TOKENS?.split(',') || [];

const developmentConfig: Config = {
  domains: ['mylogin.eth', 'poppularapp.eth', 'universal-id.eth'],
  relayerUrl: 'http://localhost:3311',
  jsonRpcUrl: 'http://localhost:18545',
  tokens: [ETHER_NATIVE_TOKEN.address, DEV_DAI_ADDRESS],
  saiTokenAddress: process.env.SAI_TOKEN_ADDRESS,
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
  network: 'ganache',
};

const kovanConfig: Config = {
  domains: ['unilogin.test'],
  relayerUrl: 'https://relayer-kovan.herokuapp.com',
  jsonRpcUrl: 'https://kovan.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d',
  tokens: [ETHER_NATIVE_TOKEN.address, ...tokens],
  saiTokenAddress: process.env.SAI_TOKEN_ADDRESS,
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
  network: 'kovan',
};

const mainnetConfig: Config = {
  domains: ['unibeta.eth', 'unitest.eth'],
  relayerUrl: 'https://relayer-mainnet.herokuapp.com',
  jsonRpcUrl: 'https://mainnet.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d',
  tokens: [ETHER_NATIVE_TOKEN.address, ...tokens],
  saiTokenAddress: process.env.SAI_TOKEN_ADDRESS,
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
  network: 'mainnet',
};

const configs = {
  ganache: developmentConfig,
  kovan: kovanConfig,
  mainnet: mainnetConfig,
};

export default configs.ganache;
