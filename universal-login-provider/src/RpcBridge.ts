export type Callback = (error: any, response: any) => void

export type Handler =
  (msg: any, cb: Callback) => void

export class RpcBridge {
  private readonly callbacks: Record<keyof any, Callback | undefined> = {}

  constructor (
    private readonly sendMessage: (msg: any) => void,
    private readonly handler: Handler,
  ) { }

  handleMessage(msg: any) {
    if (msg.magic !== MAGIC) {
      return
    }
    const rpc = msg.payload

    if(rpc.method !== undefined) {
      this.handler(rpc, (error, response) => {
        if(error) {
          if(isRealId(rpc.id)) {
            this.sendWithMagic({
              "jsonrpc": "2.0",
              "error": error,
              "id": rpc.id
            })
          }
        } else {
          this.sendMessage(response)
        }
      })
    } else {
      if(!isRealId(rpc.id)) {
        return
      }
      if(this.callbacks[rpc.id] === undefined) {
        return
      }
      this.callbacks[rpc.id]!(null, rpc)
    }
  }

  private sendWithMagic(payload: any) {
    this.sendMessage({
      magic: MAGIC,
      payload,
    })
  }

  send(msg: any, cb: Callback) {
    if(msg.id != null) {
      this.callbacks[msg.id] = cb
    }
    this.sendWithMagic(msg)
  }
}

const MAGIC = 'UNIVERSAL_LOGIN'

const isRealId = (id: any) => id != null && !isNaN(id)
