import {IPGeolocationApiConfig} from '@unilogin/commons';

export interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
  saiTokenAddress?: string;
  ipGeolocationApi: IPGeolocationApiConfig;
}

require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';

const developmentConfig: Config = {
  domains: ['mylogin.eth', 'poppularapp.eth', 'universal-id.eth'],
  relayerUrl: 'http://localhost:3311',
  jsonRpcUrl: 'http://localhost:18545',
  tokens: [ETHER_NATIVE_TOKEN.address, process.env.SAI_TOKEN_ADDRESS!, process.env.DAI_TOKEN_ADDRESS!],
  saiTokenAddress: process.env.SAI_TOKEN_ADDRESS,
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
};

export default developmentConfig;
