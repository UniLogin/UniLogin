export type Callback = (error: any, response: any) => void;

export type Handler = (msg: any, cb: Callback) => void;

export class RpcBridge {
  private readonly callbacks: Record<number, Callback | undefined> = {};

  constructor(
    private readonly sendMessage: (msg: any) => void,
    private readonly handler: Handler,
  ) {}

  handleMessage(msg: any) {
    if (msg.magic === MAGIC && msg.payload !== undefined) {
      this.handleRpc(msg.payload);
    }
  }

  private handleRpc(rpc: any) {
    if (rpc.method !== undefined) {
      this.handler(rpc, (error, response) => {
        if (error) {
          this.sendWithMagic({jsonrpc: '2.0', error: error, id: isRealId(rpc.id) ? rpc.id : null});
        } else {
          this.sendWithMagic(response);
        }
      });
    } else if (isRealId(rpc.id) && this.callbacks[rpc.id] !== undefined) {
      this.callbacks[rpc.id]!(null, rpc);
    }
  }

  private sendWithMagic(payload: any) {
    this.sendMessage({
      magic: MAGIC,
      payload,
    });
  }

  send(msg: any, cb: Callback) {
    if (isRealId(msg.id)) {
      this.callbacks[msg.id] = cb;
    }
    this.sendWithMagic(msg);
  }
}

const MAGIC = 'UNIVERSAL_LOGIN';

const isRealId = (id: any) => typeof id === 'number';
