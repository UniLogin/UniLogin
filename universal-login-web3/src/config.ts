import {Provider} from 'web3/providers';
import {HttpProvider} from './services/HttpProvider';
import {Network, ETHER_NATIVE_TOKEN, DEV_DAI_ADDRESS} from '@unilogin/commons';

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
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0x6b175474e89094c44da98b954eedeac495271d0f', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x0417912b3a7AF768051765040A55BB0925D4DDcF'],
      };
    case '3':
    case 'ropsten':
      return {
        network: 'ropsten',
        provider: new HttpProvider('https://ropsten.infura.io/v3/38473dae09c34dcb8c06bd0752944815'),
        relayerUrl: 'https://relayer-ropsten.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0xcd472179470ece764b5a90da2e79bb16e500a85c'],
      };
    case '4':
    case 'rinkeby':
      return {
        network: 'rinkeby',
        provider: new HttpProvider('https://rinkeby.infura.io/v3/a7b3f39ac97a4f5ab4086410d2d27b30'),
        relayerUrl: 'https://relayer-rinkeby.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0xef77ce798401dac8120f77dc2debd5455eddacf9'],
      };
    case '42':
    case 'kovan':
      return {
        network: 'kovan',
        provider: new HttpProvider('https://kovan.infura.io/v3/ddbb59bc09094dd4ae516d6ce95c37a0'),
        relayerUrl: 'https://relayer-kovan.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0x08ae34860fbfe73e223596e65663683973c72dd3'],
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
