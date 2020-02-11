import Web3 from 'web3';
import {Web3PickerProvider} from '../Web3PickerProvider';
import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {setupStrategies} from './setupStrategies';
import {getApplicationInfoFromDocument} from '../ui/utils/applicationInfo';
import {ApplicationInfo} from '@universal-login/commons';

export type Strategy = 'UniLogin' | 'Metamask' | Web3ProviderFactory;

export class UniLogin {
  static setupWeb3Picker(web3: Web3, strategies: Strategy[], givenApplicationInfo?: Partial<ApplicationInfo>) {
    const provider = web3.currentProvider;
    const applicationInfo = {...getApplicationInfoFromDocument(), ...givenApplicationInfo};
    const web3ProviderFactories = setupStrategies(web3.currentProvider, strategies, {applicationInfo});
    const web3PickerProvider = new Web3PickerProvider(web3ProviderFactories, provider);
    web3.setProvider(web3PickerProvider);
    return web3PickerProvider;
  }
}
