import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {Web3ProviderNotFound} from '../ui/utils/errors';

export const browserWeb3ProviderFactory: Web3ProviderFactory = {
  name: 'Browser Web3',
  icon: 'Browser Web3 logo',
  create: () => {
    if (window.ethereum) {
      return window.ethereum;
    } else if (window.web3 && window.web3.currentProvider) {
      return window.web3.currentProvider;
    } else {
      throw new Web3ProviderNotFound();
    }
  },
};
