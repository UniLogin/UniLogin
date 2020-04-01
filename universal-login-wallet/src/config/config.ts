require('dotenv').config();
import {ETHER_NATIVE_TOKEN, Network} from '@unilogin/commons';

export default Object.freeze({

  development: {
    network: 'ganache' as Network,
    domains: ['mylogin.eth'],
    relayerUrl: 'http://localhost:3311',
    jsonRpcUrl: 'http://localhost:18545',
    tokens: [ETHER_NATIVE_TOKEN.address, '0xd19Fbe8878507D0Aa9f2F6Acf40Ff6C21d6CecE8', '0x9Ad7E60487F3737ed239DAaC172A4a9533Bd9517'],
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
    domains: [process.env.ENS_DOMAIN_1!, process.env.ENS_DOMAIN_2!],
    relayerUrl: process.env.RELAYER_URL!,
    jsonRpcUrl: process.env.JSON_RPC_URL!,
    tokens: [ETHER_NATIVE_TOKEN.address, process.env.DAI_TOKEN_ADDRESS!, process.env.JRT_TOKEN_ADDRESS!],
    rampUrl: process.env.RAMP_URL,
  },
});
