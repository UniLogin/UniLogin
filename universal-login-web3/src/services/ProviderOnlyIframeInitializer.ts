import {ULWeb3Provider} from '../ULWeb3Provider';
import {forEach} from 'reactive-properties';
import {IframeInitializerBase} from './IframeInitializerBase';
import {Provider} from 'web3/providers';

export class ProviderOnlyIframeInitializer extends IframeInitializerBase{
  private readonly provider: ULWeb3Provider;

  constructor() {
    super();
    this.provider = ULWeb3Provider.getDefaultProvider('kovan');
  }

  async init() {
    await this.provider.init();

    this.provider.isUiVisible.pipe(forEach(
      isVisible => this.setIframeVisibility(isVisible),
    ));

    this.sendReadySignal();
  }

  protected getProvider(): Provider {
    return this.provider;
  }
}
