import Web3 from 'web3';
import {Web3Strategy} from '../Web3Strategy';
import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {setupStrategies} from '../utils/setupStrategies';
import {ApplicationInfo} from '@universal-login/commons';

export type Strategy = 'UniLogin' | 'Metamask' | Web3ProviderFactory;

export class UniLogin {
  static setupWeb3Picker(web3: Web3, strategies: Strategy[], applicationInfo?: ApplicationInfo) {
    const provider = web3.currentProvider;
    const web3ProviderFactories = setupStrategies(web3, strategies, {applicationInfo});
    const web3Strategy = new Web3Strategy(web3ProviderFactories, provider);
    web3.setProvider(web3Strategy);
    return web3Strategy;
  }
}
