import {ULWeb3Provider} from '../ULWeb3Provider';
import {Property} from 'reactive-properties';
import {IframeInitializerBase} from './IframeInitializerBase';
import {Provider} from 'web3/providers';

export class ProviderOnlyIframeInitializer extends IframeInitializerBase {
  private readonly provider: ULWeb3Provider;

  constructor() {
    super();
    this.provider = ULWeb3Provider.getDefaultProvider('kovan');
  }

  async start() {
    await this.provider.init();
    await super.start();
  }

  protected getProvider(): Provider {
    return this.provider;
  }

  protected getIsUiVisible(): Property<boolean> {
    return this.provider.isUiVisible;
  }

  protected getHasNotifications(): Property<boolean> {
    return this.provider.hasNotifications;
  }
}
