import {Web3PickerProvider} from '../Web3PickerProvider';
import {setupStrategies} from '../api/setupStrategies';
import {combine, flat, map, Property, State} from 'reactive-properties';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {IframeInitializerBase} from './IframeInitializerBase';
import {Provider} from 'web3/providers';
import {ApplicationInfo} from '@universal-login/commons';

export class PickerIframeInitializer extends IframeInitializerBase {
  private readonly provider: Web3PickerProvider;

  constructor(applicationInfo: ApplicationInfo) {
    super();
    const web3ProviderFactories = setupStrategies(this.bridge, ['UniLogin', 'Metamask'], {applicationInfo});
    this.provider = new Web3PickerProvider(web3ProviderFactories, this.bridge);
  }

  protected getProvider(): Provider {
    return this.provider;
  }

  protected getIsUiVisible(): Property<boolean> {
    return combine([
      this.provider.isVisible,
      this.provider.currentProvider.pipe(
        map(provider => provider instanceof ULWeb3Provider ? provider.isUiVisible : new State(false)),
        flat,
      ),
    ], (a, b) => a || b);
  }
}
