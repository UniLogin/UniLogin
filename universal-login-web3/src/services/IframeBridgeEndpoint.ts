import {Callback, RpcBridge} from './RpcBridge';
import {Provider} from 'web3/providers';

export class IframeBridgeEndpoint {
  private handler?: Provider;
  public readonly bridge: RpcBridge;

  constructor() {
    this.bridge = new RpcBridge(
      msg => window.top.postMessage(msg, '*'),
      this.handle.bind(this),
    );
    window.addEventListener('message', e => this.bridge.handleMessage(e.data));
  }

  private handle(msg: any, cb: Callback) {
    if (this.handler) {
      this.handler.send(msg, cb as any);
    } else {
      console.error('RPC dropped by iframe as no handler was set', msg);
    }
  }

  setHandler(handler: Provider) {
    this.handler = handler;
  }

  public setNotificationIndicator(hasNotifications: boolean) {
    this.bridge.send({method: 'ul_set_notification_indicator', params: [hasNotifications]}, () => {});
  }

  public setIframeVisibility(isVisible: boolean) {
    this.bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
  }

  public sendReadySignal() {
    this.bridge.send({method: 'ul_ready'}, () => {});
  }
}
