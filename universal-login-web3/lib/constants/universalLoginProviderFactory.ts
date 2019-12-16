import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {ULWeb3Provider} from '..';
import {getConfigForNetwork} from '../config';

export const universalLoginProviderFactory: Web3ProviderFactory = {
  name: 'UniversalLogin',
  icon: 'UniversalLogin logo',
  create: () => new ULWeb3Provider(getConfigForNetwork('kovan')),
};
