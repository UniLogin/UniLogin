import {RpcBridge} from './RpcBridge';

const IFRAME_BACKEND_URL = 'https://universal-provider-backend.netlify.com';

export class ULIFrameProvider {
  private iframe: HTMLIFrameElement;
  private bridge: RpcBridge;

  constructor() {
    this.iframe = createIFrame();
    this.bridge = new RpcBridge(
      msg => this.iframe.contentWindow!.postMessage(msg, '*'),
      this.handleRpc.bind(this),
    );
    window.addEventListener('message', e => this.bridge.handleMessage(e.data));
  }

  private handleRpc(msg: any, cb: (error: any, response: any) => void) {

  }

  static create() {
    return new ULIFrameProvider();
  }

  send(msg: any, cb: (error: any, response: any) => void) {
    this.bridge.send(msg, cb);
  }

  openDashboard() {
    this.send({method: 'ul_open_dashboard'}, () => {});
  }

  closeDashboard() {
    this.send({method: 'ul_close_dashboard'}, () => {});
  }
}

function createIFrame() {
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    // position: 'fixed',
    width: '100vw',
    height: '100vh',
    left: '0',
    top: '0',
    background: 'none transparent',
    border: 'none',
  })
  iframe.setAttribute('src', IFRAME_BACKEND_URL);
  document.getElementsByTagName('body')[0].appendChild(iframe);
  return iframe;
}
