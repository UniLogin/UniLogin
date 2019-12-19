import {Provider} from 'web3/providers';
import Web3 from 'web3';

export type Network
  = '1' | 'mainnet'
  | '3' | 'ropsten'
  | '4' | 'rinkeby'
  | '42' | 'kovan';

export interface Config {
  provider: Provider;
  relayerUrl: string;
  ensDomains: string[];
}

export function getConfigForNetwork(network: Network): Config {
  switch (network) {
    case '1':
    case 'mainnet':
      return {
        provider: new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-mainnet.herokuapp.com',
        ensDomains: ['unitest.eth'],
      };
    case '3':
    case 'ropsten':
      return {
        provider: new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-ropsten.herokuapp.com',
        ensDomains: ['poppularapp.test'],
      };
    case '4':
    case 'rinkeby':
      return {
        provider: new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-rinkeby.herokuapp.com',
        ensDomains: ['poppularapp.test'],
      };
    case '42':
    case 'kovan':
      return {
        provider: new Web3.providers.HttpProvider('https://kovan.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'),
        relayerUrl: 'https://relayer-kovan.herokuapp.com',
        ensDomains: ['poppularapp.test'],
      };
    default:
      throw new Error(`Invalid network: ${network}`);
  }
}
