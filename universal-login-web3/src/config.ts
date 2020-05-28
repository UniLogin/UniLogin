import {Provider} from 'web3/providers';
import {HttpProvider} from './services/HttpProvider';
import {Network, ETHER_NATIVE_TOKEN, DEV_DAI_ADDRESS} from '@unilogin/commons';

export interface Config {
  network: Network;
  provider: Provider;
  relayerUrl: string;
  ensDomains: string[];
  observedTokensAddresses: string[];
  showTransactionDialog: boolean;
}

const showTransactionDialog = true;

export function getConfigForNetwork(network: Network): Config {
  switch (network) {
    case '1':
    case 'mainnet':
      return {
        network: 'mainnet',
        provider: new HttpProvider('https://mainnet.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-mainnet.herokuapp.com',
        ensDomains: ['unibeta.eth', 'unitest.eth'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0x6b175474e89094c44da98b954eedeac495271d0f'],
        showTransactionDialog,
      };
    case '3':
    case 'ropsten':
      return {
        network: 'ropsten',
        provider: new HttpProvider('https://ropsten.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-ropsten.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0xcd472179470ece764b5a90da2e79bb16e500a85c'],
        showTransactionDialog,
      };
    case '4':
    case 'rinkeby':
      return {
        network: 'rinkeby',
        provider: new HttpProvider('https://rinkeby.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-rinkeby.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0xef77ce798401dac8120f77dc2debd5455eddacf9'],
        showTransactionDialog,
      };
    case '42':
    case 'kovan':
      return {
        network: 'kovan',
        provider: new HttpProvider('https://kovan.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-kovan.herokuapp.com',
        ensDomains: ['unilogin.test'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, '0x08ae34860fbfe73e223596e65663683973c72dd3'],
        showTransactionDialog
      };
    case '8545':
    case 'ganache':
      return {
        network: 'ganache',
        provider: new HttpProvider('http://localhost:18545'),
        relayerUrl: 'http://localhost:3311',
        ensDomains: ['mylogin.eth', 'universal-id.eth', 'popularapp.eth'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address, DEV_DAI_ADDRESS],
        showTransactionDialog
      };
    default:
      throw new Error(`Invalid network: ${network}`);
  }
}
