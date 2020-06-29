require('dotenv').config();
import {ETHER_NATIVE_TOKEN, Network, DEV_DAI_ADDRESS} from '@unilogin/commons';

const getListFromEnv = (env?: string) => env?.split(',') || [];

export default Object.freeze({

  development: {
    network: 'ganache' as Network,
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [ETHER_NATIVE_TOKEN.address, '0xd19Fbe8878507D0Aa9f2F6Acf40Ff6C21d6CecE8', DEV_DAI_ADDRESS],
    apiKey: 'aaaa-bbbb-cccc',
  },

  test: {
    network: 'ganache' as Network,
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:33113',
    jsonRpcUrl: 'http://localhost:8545',
    tokens: [ETHER_NATIVE_TOKEN.address],
  },

  production: {
    network: process.env.NETWORK as Network,
    domains: getListFromEnv(process.env.ENS_DOMAINS),
    relayerUrl: process.env.RELAYER_URL!,
    jsonRpcUrl: process.env.JSON_RPC_URL!,
    tokens: [ETHER_NATIVE_TOKEN.address, ...getListFromEnv(process.env.TOKENS)],
    rampApiKey: process.env.RAMP_API_KEY,
    apiKey: process.env.API_KEY,
  },
});
