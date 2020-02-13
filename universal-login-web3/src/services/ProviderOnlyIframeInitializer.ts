import {ULWeb3Provider} from '../ULWeb3Provider';
import {RpcBridge} from './RpcBridge';
import {forEach} from 'reactive-properties';
import {IframeInitializerBase} from './IframeInitializerBase';

export class ProviderOnlyIframeInitializer extends IframeInitializerBase{

  async init() {
    const universalLogin = ULWeb3Provider.getDefaultProvider('kovan');
    await universalLogin.init();

    const bridge = new RpcBridge(
      msg => window.top.postMessage(msg, '*'),
      universalLogin.send.bind(universalLogin) as any,
    );
    window.addEventListener('message', e => bridge.handleMessage(e.data));

    universalLogin.isUiVisible.pipe(forEach(
      isVisible => this.setIframeVisibility(bridge, isVisible),
    ));

    this.sendReadySignal(bridge);
  }
}
