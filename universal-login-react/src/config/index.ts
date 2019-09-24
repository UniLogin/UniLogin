import {Config} from './types';

require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

const developmentConfig: Config = {
  domains: ['mylogin.eth'],
  relayerUrl: 'http://localhost:3311',
  jsonRpcUrl: 'http://localhost:18545',
  tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address],
  ipGeolocationApi: {
    baseUrl: 'http://api.ipstack.com',
    accessKey: '52e66f1c79bb597131fd0c133704ee03',
  }
};

export default developmentConfig;
