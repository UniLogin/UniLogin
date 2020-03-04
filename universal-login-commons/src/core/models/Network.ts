import {asEnum} from '@restless/sanitizers';

export type Network
= '1' | 'mainnet'
| '3' | 'ropsten'
| '4' | 'rinkeby'
| '42' | 'kovan'
| '8545' | 'ganache'
| 'test';

export const Network = {
  toNumericId(network: Network): number {
    switch (network) {
      case '1':
      case 'mainnet':
        return 1;
      case '3':
      case 'ropsten':
        return 3;
      case '4':
      case 'rinkeby':
        return 4;
      case '42':
      case 'kovan':
        return 42;
      case '8545':
      case 'ganache':
        return 8545;
      case 'test':
        return 0;
      default:
        throw new TypeError(`Invalid network: ${network}`);
    }
  },
  equals(left: Network, right: Network) {
    return Network.toNumericId(left) === Network.toNumericId(right);
  },
};

export const asNetwork = asEnum<Network>(['1', 'mainnet', '3', 'ropsten', '4', 'rinkeby', '42', 'kovan', '8545', 'ganache', 'test'], 'Network');
