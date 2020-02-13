import Web3 from 'web3';
import {Web3PickerProvider} from '../Web3PickerProvider';
import {Web3ProviderFactory} from '../models/Web3ProviderFactory';
import {setupStrategies, SetupUniLoginOverrides} from './setupStrategies';
import {getApplicationInfoFromDocument} from '../ui/utils/applicationInfo';
import {ApplicationInfo} from '@universal-login/commons';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {getNetworkId} from '../utils/getNetworkId';
import {getConfigForNetwork, Network} from '../config';
import {JsonRpcProvider} from 'ethers/providers';
import {Provider} from 'web3/providers';

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

  static async showUniButton(web3: Web3, overrideStyles?: Record<string, string>) {
    const currentProvider = web3.currentProvider;
    if (!(currentProvider instanceof Web3PickerProvider)) {
      return;
    }
    if (currentProvider.providerName === 'UniLogin') {
      (currentProvider.currentProvider.get()! as ULWeb3Provider).initWeb3Button(overrideStyles);
    }
  }

  static async isUniLogin(web3: Web3) {
    const currentProvider = web3.currentProvider;
    if (!(currentProvider instanceof Web3PickerProvider)) {
      return false;
    }
    return (currentProvider.currentProvider.get()! as ULWeb3Provider).isUniLogin;
  }

  static async createULProvider(provider: Provider | JsonRpcProvider, overrides?: SetupUniLoginOverrides) {
    const networkVersion = await getNetworkId(provider) as Network;
    const uniLoginConfig = getConfigForNetwork(networkVersion);
    const ulProvider = new ULWeb3Provider({
      ...uniLoginConfig,
      applicationInfo: overrides?.applicationInfo,
      storageService: overrides?.storageService,
    });
    await ulProvider.init();
    return ulProvider;
  };
}
