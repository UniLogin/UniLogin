import {Provider} from 'web3/providers';
import {HttpProvider} from './services/HttpProvider';
import {Network, DAI_KOVAN, DAI_MAINNET, DAI_ROPSTEN, DAI_RINKEBY, DEV_DAI_ADDRESS, ETHER_NATIVE_TOKEN, LID_MAINNET, USDC_MAINNET} from '@unilogin/commons';

export interface Config {
  network: Network;
  provider: Provider;
  relayerUrl: string;
  ensDomains: string[];
  observedTokensAddresses: string[];
}

export function getConfigForNetwork(network: Network): Config {
  switch (network) {
    case '1':
    case 'mainnet':
      return {
        network: 'mainnet',
        provider: new HttpProvider('https://mainnet.infura.io/v3/7dd9fc79d94f40ccbc0d8821551516dd'),
        relayerUrl: 'https://relayer-mainnet.herokuapp.com',
        ensDomains: ['unibeta.eth', 'unitest.eth'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, DAI_MAINNET, USDC_MAINNET, LID_MAINNET],
      };
    case '3':
    case 'ropsten':
      return {
        network: 'ropsten',
        provider: new HttpProvider('https://ropsten.infura.io/v3/38473dae09c34dcb8c06bd0752944815'),
        relayerUrl: 'https://relayer-ropsten.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, DAI_ROPSTEN],
      };
    case '4':
    case 'rinkeby':
      return {
        network: 'rinkeby',
        provider: new HttpProvider('https://rinkeby.infura.io/v3/a7b3f39ac97a4f5ab4086410d2d27b30'),
        relayerUrl: 'https://relayer-rinkeby.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, DAI_RINKEBY],
      };
    case '42':
    case 'kovan':
      return {
        network: 'kovan',
        provider: new HttpProvider('https://kovan.infura.io/v3/ddbb59bc09094dd4ae516d6ce95c37a0'),
        relayerUrl: 'https://relayer-kovan.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, DAI_KOVAN],
      };
    case '8545':
    case 'ganache':
      return {
        network: 'ganache',
        provider: new HttpProvider('http://localhost:18545'),
        relayerUrl: 'http://localhost:3311',
        ensDomains: ['mylogin.eth', 'universal-id.eth', 'popularapp.eth'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, DEV_DAI_ADDRESS],
      };
    default:
      throw new Error(`Invalid network: ${network}`);
  }
}
