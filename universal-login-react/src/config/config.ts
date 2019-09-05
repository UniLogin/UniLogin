require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

const developmentConfig = {
  domains: ['poppularapp.test'],
  relayerUrl: 'https://relayer-rinkeby.herokuapp.com',
  jsonRpcUrl: 'https://rinkeby.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d',
  tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address],
};

export default developmentConfig;
