import {Provider} from 'web3/providers';
import {ULWeb3Provider} from './ULWeb3Provider';
import {getConfigForNetwork} from './config';
import {Web3ProviderNotFound} from './ui/utils/errors';

export interface Web3ProviderFactory {
  icon: string;
  name: string;
  create: () => Provider;
}

export const universalLoginProviderFactory: Web3ProviderFactory = {
  name: 'UniversalLogin',
  icon: 'UniversalLogin logo',
  create: () => new ULWeb3Provider(getConfigForNetwork('kovan')),
};

export const browserWeb3ProviderFactory: Web3ProviderFactory = {
  name: 'Browser Web3',
  icon: 'Browser Web3 logo',
  create: () => {
    if (window.ethereum) {
      return window.ethereum;
    } else if (window.web3) {
      return window.web3.currentProvider;
    } else {
      throw new Web3ProviderNotFound();
    }
  },
};
