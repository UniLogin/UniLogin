require('dotenv').config();
import {ETHER_NATIVE_TOKEN, Network} from '@unilogin/commons';

export default Object.freeze({

  development: {
    network: 'ganache' as Network,
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [ETHER_NATIVE_TOKEN.address, process.env.DAI_TOKEN_ADDRESS!, process.env.SAI_TOKEN_ADDRESS!],
    saiTokenAddress: process.env.SAI_TOKEN_ADDRESS!,
  },

  test: {
    network: 'ganache' as Network,
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [ETHER_NATIVE_TOKEN.address, process.env.DAI_TOKEN_ADDRESS!, process.env.SAI_TOKEN_ADDRESS!],
    saiTokenAddress: process.env.SAI_TOKEN_ADDRESS!,
  },

  production: {
    network: process.env.NETWORK as Network,
    domains: [process.env.ENS_DOMAIN_1!],
    relayerUrl: process.env.RELAYER_URL!,
    jsonRpcUrl: process.env.JSON_RPC_URL!,
    tokens: [ETHER_NATIVE_TOKEN.address, process.env.DAI_TOKEN_ADDRESS!, process.env.SAI_TOKEN_ADDRESS!],
    saiTokenAddress: process.env.SAI_TOKEN_ADDRESS!,
  },
});
