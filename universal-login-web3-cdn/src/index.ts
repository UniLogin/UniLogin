class ULRemoteProvider {
  private iframe?: HTMLIFrameElement
  private listeners: Record<number, (response: any) => void | undefined> = {}

  init() {
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('src', 'http://localhost:8080');
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


const provider = new ULRemoteProvider()
provider.init()

declare const Web3: any;

(window as any).web3 = new Web3(provider)
