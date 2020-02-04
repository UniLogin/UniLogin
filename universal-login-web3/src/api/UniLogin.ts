import Web3 from 'web3';
import {Web3Strategy} from '../Web3Strategy';
import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {setupStrategies} from '../utils/setupStrategies';

export type Strategy = 'UniLogin' | 'Metamask' | Web3ProviderFactory;

export class UniLogin {
  static setupWeb3Picker(web3: Web3, strategies: Strategy[]) {
    const provider = web3.currentProvider;
    const web3ProviderFactories = setupStrategies(web3, strategies);
    const web3Strategy = new Web3Strategy(web3ProviderFactories, provider);
    web3.setProvider(web3Strategy);
    return web3Strategy;
  }
}
