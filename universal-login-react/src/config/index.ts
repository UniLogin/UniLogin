import {Config} from './types';

require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

const developmentConfig: Config = {
  domains: ['mylogin.eth'],
  relayerUrl: 'http://localhost:3311',
  jsonRpcUrl: 'http://localhost:18545',
  tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address],
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
};

export default developmentConfig;
