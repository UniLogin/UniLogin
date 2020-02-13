import {ULWeb3Provider} from '../ULWeb3Provider';
import {forEach} from 'reactive-properties';
import {IframeInitializerBase} from './IframeInitializerBase';
import {Provider} from 'web3/providers';

export class ProviderOnlyIframeInitializer extends IframeInitializerBase{
  private provider: ULWeb3Provider | undefined;

  async init() {
    this.provider = ULWeb3Provider.getDefaultProvider('kovan');
    await this.provider!.init();

    this.provider!.isUiVisible.pipe(forEach(
      isVisible => this.setIframeVisibility(isVisible),
    ));

    this.sendReadySignal();
  }

  protected getProvider(): Provider {
    return this.provider!;
  }
}
