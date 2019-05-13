require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

export default Object.freeze({
  
  development: {
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address]
  },
  
  test: {
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address]
  },

  production: {
    domains: [process.env.ENS_DOMAIN!],
    relayerUrl: process.env.RELAYER_URL!,
    jsonRpcUrl: process.env.JSON_RPC_URL!,
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address]
  }
});
