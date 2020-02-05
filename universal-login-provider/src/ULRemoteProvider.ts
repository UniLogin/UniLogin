const IFRAME_BACKEND_URL = 'https://html-1bzwf3635.now.sh';

export class ULIFrameProvider {
  private iframe?: HTMLIFrameElement
  private listeners: Record<number, (response: any) => void | undefined> = {}

  constructor() {
    this.iframe = document.createElement('iframe');
    // this.iframe.style.position = 'fixed';
    this.iframe.style.width = '100vw';
    this.iframe.style.height = '100vh';
    this.iframe.style.left = '0';
    this.iframe.style.top = '0';
    this.iframe.style.background = 'none transparent';
    this.iframe.style.border = 'none';
    this.iframe.setAttribute('src', IFRAME_BACKEND_URL);
    document.getElementsByTagName('body')[0].appendChild(this.iframe);

    window.addEventListener('message', event => {
      if(event.data.type !== 'ulRPC') {
        return
      }
      const rpc = event.data.payload
      if(typeof rpc.id !== 'number') {
        console.error('invalid JSON rpc', event.data)
        return
      }
      console.log('<', rpc)
      if(this.listeners[rpc.id] === undefined) {
        console.error('no listener registered for RPC', rpc)
        return
      }
      this.listeners[rpc.id](rpc)
    })
  }

  static create() {
    return new ULIFrameProvider()
  }

  send(msg: any, cb: (error: any, response: any) => void) {
    this.listeners[msg.id] = (resp: any) => cb(null, resp)

    console.log('>', msg)
    this.iframe!.contentWindow!.postMessage({ type: 'ulRPC', payload: msg }, '*')
  }

  openDashboard() {
    this.send({ method: 'ul_open_dashboard' }, () => {})
  }

  closeDashboard() {
    this.send({ method: 'ul_close_dashboard' }, () => {})
  }
}
