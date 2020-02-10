import {RpcBridge} from './RpcBridge';
import {DEFAULT_CONFIG} from './config';
import {createIFrame} from './createIframe';

export interface Provider {
  send: (msg: any, cb: (err: any, response: any) => void) => void;
}

export class ULIFrameProvider {
  private iframe: HTMLIFrameElement;
  private bridge: RpcBridge;

  constructor(
    private readonly upstream: Provider,
    config = DEFAULT_CONFIG,
    enablePicker = false,
  ) {
    this.iframe = createIFrame(config.backendUrl + (enablePicker ? '?picker' : ''));
    this.bridge = new RpcBridge(
      msg => this.iframe.contentWindow!.postMessage(msg, '*'),
      this.handleRpc.bind(this),
    );
    window.addEventListener('message', e => this.bridge.handleMessage(e.data));
  }

  private handleRpc(msg: any, cb: (error: any, response: any) => void) {
    switch (msg.method) {
      case 'ul_set_iframe_visibility':
        this.setIframeVisibility(msg.params[0]);
        break;
      default:
        this.upstream.send(msg, cb);
    }
  }

  private setIframeVisibility(visible: boolean) {
    this.iframe.style.display = visible ? 'unset' : 'none';
  }

  static create(upstream: Provider, config = DEFAULT_CONFIG) {
    return new ULIFrameProvider(upstream, config);
  }

  static createPicker(upstream: Provider, config = DEFAULT_CONFIG) {
    return new ULIFrameProvider(upstream, config, true);
  }

  send(msg: any, cb: (error: any, response: any) => void) {
    this.bridge.send(msg, cb);
  }

  setDashboardVisibility(visible: boolean) {
    this.send({method: 'ul_set_dashboard_visibility', params: [visible]}, () => {});
  }

  openDashboard() {
    this.setDashboardVisibility(true);
  }

  closeDashboard() {
    this.setDashboardVisibility(false);
  }
}
