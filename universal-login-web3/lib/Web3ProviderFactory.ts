import {Provider} from 'web3/providers';
import {ULWeb3Provider} from './ULWeb3Provider';
import {ensureNotNull} from '@universal-login/commons';
import {getConfigForNetwork} from './config';

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

export const metaMaskProviderFactory: Web3ProviderFactory = {
  name: 'MetaMask',
  icon: 'MetaMask logo',
  create: () => {
    ensureNotNull(window.ethereum, Error, 'MetaMask is not enabled');
    return window.ethereum;
  },
};
