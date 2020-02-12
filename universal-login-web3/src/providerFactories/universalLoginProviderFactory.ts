import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {ULWeb3Provider} from '..';
import {getConfigForNetwork} from '../config';

export const universalLoginProviderFactory: Web3ProviderFactory = {
  name: 'UniLogin',
  icon: 'UniLogin logo',
  create: async () => {
    const provider = new ULWeb3Provider(getConfigForNetwork('kovan'));
    await provider.init();
    return provider;
  },
};
