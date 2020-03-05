import {ULWeb3Provider} from '../ULWeb3Provider';
import {Property} from 'reactive-properties';
import {IframeInitializerBase} from './IframeInitializerBase';
import {Provider} from 'web3/providers';
import {Network} from '@unilogin/commons';
import {IframeBridgeEndpoint} from './IframeBridgeEndpoint';

export class ProviderOnlyIframeInitializer extends IframeInitializerBase {
  private readonly provider: ULWeb3Provider;

  constructor(endpoint: IframeBridgeEndpoint, network: Network) {
    super(endpoint);
    this.provider = ULWeb3Provider.getDefaultProvider(network);
    endpoint.setHandler(this.provider);
  }

  async start() {
    await super.start();
    await this.provider.init();
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
