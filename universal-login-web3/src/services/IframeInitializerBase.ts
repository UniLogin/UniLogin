import {RpcBridge} from './RpcBridge';
import {Provider} from 'web3/providers';

export abstract class IframeInitializerBase {
  protected readonly bridge: RpcBridge;

  protected abstract getProvider(): Provider;

  constructor() {
    this.bridge = new RpcBridge(
      msg => window.top.postMessage(msg, '*'),
      (req, cb) => this.getProvider().send(req, cb as any),
    );
    window.addEventListener('message', e => this.bridge.handleMessage(e.data));
  }

  protected setIframeVisibility(isVisible: boolean) {
    this.bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
  }

  protected sendReadySignal() {
    this.bridge.send({method: 'ul_ready'}, () => {});
  }
}
