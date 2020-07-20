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
        provider: new HttpProvider('https://eth-mainnet.alchemyapi.io/v2/3ieYU1sRgYk5UzTug4ZTH4gDceJUQM5b'),
        relayerUrl: 'https://relayer-mainnet.herokuapp.com',
        ensDomains: ['unibeta.eth', 'unitest.eth'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0x6b175474e89094c44da98b954eedeac495271d0f', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
      };
    case '3':
    case 'ropsten':
      return {
        network: 'ropsten',
        provider: new HttpProvider('https://eth-ropsten.alchemyapi.io/v2/_R4thjduHrjQduj0VDqo0s15yegdewzP'),
        relayerUrl: 'https://relayer-ropsten.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0xcd472179470ece764b5a90da2e79bb16e500a85c'],
      };
    case '4':
    case 'rinkeby':
      return {
        network: 'rinkeby',
        provider: new HttpProvider('https://eth-rinkeby.alchemyapi.io/v2/uuu-4ZbLoMQouPcL5Vf-7m8ifgHo5beg'),
        relayerUrl: 'https://relayer-rinkeby.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0xef77ce798401dac8120f77dc2debd5455eddacf9'],
      };
    case '42':
    case 'kovan':
      return {
        network: 'kovan',
        provider: new HttpProvider('https://eth-kovan.alchemyapi.io/v2/QRGk3mhWs67ZkT5hnjB_DZui4XJ3UpcS'),
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
