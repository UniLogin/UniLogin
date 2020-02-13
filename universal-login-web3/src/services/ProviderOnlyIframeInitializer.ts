import {ULWeb3Provider} from '../ULWeb3Provider';
import {RpcBridge} from './RpcBridge';
import {forEach} from 'reactive-properties';

export class ProviderOnlyIframeInitializer {

  setIframeVisibility(bridge: RpcBridge, isVisible: boolean) {
    bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
  }

  sendReadySignal(bridge: RpcBridge) {
    bridge.send({method: 'ul_ready'}, () => {});
  }

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
