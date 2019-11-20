require('dotenv').config();
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

export default Object.freeze({

  development: {
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address],
    newVersionLink: 'http://localhost:8080',
  },

  test: {
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address],
    newVersionLink: 'http://localhost:8080',
  },

  production: {
    domains: [process.env.ENS_DOMAIN_1!],
    relayerUrl: process.env.RELAYER_URL!,
    jsonRpcUrl: process.env.JSON_RPC_URL!,
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS!, ETHER_NATIVE_TOKEN.address],
    newVersionLink: process.env.NEW_VERSION_LINK,
  },
});
