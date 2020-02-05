import {RpcBridge} from '@universal-login/commons'

const IFRAME_BACKEND_URL = 'https://html-1bzwf3635.now.sh';

export class ULIFrameProvider {
  private iframe: HTMLIFrameElement
  private bridge: RpcBridge

  constructor() {
    this.iframe = createIFrame()
    this.bridge = new RpcBridge(
      msg => this.iframe.contentWindow!.postMessage(msg, '*'),
      this.handleRpc.bind(this),
    )
    window.addEventListener('message', e => this.bridge.handleMessage(e.data))
  }

  private handleRpc(msg: any, cb: (error: any, response: any) => void) {

  }

  static create() {
    return new ULIFrameProvider()
  }

  send(msg: any, cb: (error: any, response: any) => void) {
    this.bridge.send(msg, cb)
  }

  openDashboard() {
    this.send({ method: 'ul_open_dashboard' }, () => {})
  }

  closeDashboard() {
    this.send({ method: 'ul_close_dashboard' }, () => {})
  }
}

function createIFrame() {
  const iframe = document.createElement('iframe');
  // iframe.style.position = 'fixed';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.left = '0';
  iframe.style.top = '0';
  iframe.style.background = 'none transparent';
  iframe.style.border = 'none';
  iframe.setAttribute('src', IFRAME_BACKEND_URL);
  document.getElementsByTagName('body')[0].appendChild(iframe);
  return iframe
}
