import {Provider} from 'web3/providers';
import Web3 from 'web3';

export type Network = 'rinkeby';

export interface Config {
  provider: Provider;
  relayerUrl: string;
  ensDomains: string[];
}

export function getConfigForNetwork(network: Network): Config {
  switch (network) {
    case 'rinkeby':
      return {
        provider: new Web3.providers.HttpProvider('https://rinkeby.infura.io'),
        relayerUrl: 'https://relayer-rinkeby.herokuapp.com',
        ensDomains: ['poppularapp.test'],
      };
    default:
      throw new Error(`Invalid network: ${network}`);
  }
}
