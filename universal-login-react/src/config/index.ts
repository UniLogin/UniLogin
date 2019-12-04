import {Config} from './types';

require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

const developmentConfig: Config = {
  domains: ['mylogin.eth'],
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
