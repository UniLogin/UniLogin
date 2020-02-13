import {Web3PickerProvider} from '../Web3PickerProvider';
import {setupStrategies} from '../api/setupStrategies';
import {combine, flat, map, Property, State} from 'reactive-properties';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {EMPTY_LOGO} from '@universal-login/commons';
import {IframeInitializerBase} from './IframeInitializerBase';
import {Provider} from 'web3/providers';

export class PickerIframeInitializer extends IframeInitializerBase {
  private readonly provider: Web3PickerProvider;

  constructor() {
    super();
    const applicationInfo = {applicationName: 'Embeded', logo: EMPTY_LOGO, type: 'laptop'}; // TODO: get from query
    const web3ProviderFactories = setupStrategies(this.bridge, ['Metamask', 'UniLogin'], {applicationInfo});
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
