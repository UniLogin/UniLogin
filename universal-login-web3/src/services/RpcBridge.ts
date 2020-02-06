export type Callback = (error: any, response: any) => void;

export type Handler = (msg: any, cb: Callback) => void;

export class RpcBridge {
  private readonly callbacks: Record<number, Callback | undefined> = {};

  constructor(
    private readonly sendMessage: (msg: any) => void,
    private readonly handler: Handler,
  ) {}

  handleMessage(msg: any) {
    if (msg.protocolId === PROTOCOL_ID && msg.payload !== undefined) {
      this.handleRpc(msg.payload);
    }
  }

  private handleRpc(rpc: any) {
    if (rpc.method !== undefined) {
      this.handler(rpc, (error, response) => {
        if (error) {
          this.sendWithProtocolId({jsonrpc: '2.0', error: error, id: isProperId(rpc.id) ? rpc.id : null});
        } else {
          this.sendWithProtocolId(response);
        }
      });
    } else if (isProperId(rpc.id) && this.callbacks[rpc.id] !== undefined) {
      this.callbacks[rpc.id]!(null, rpc);
    }
  }

  private sendWithProtocolId(payload: any) {
    this.sendMessage({
      protocolId: PROTOCOL_ID,
      payload,
    });
  }

  send(msg: any, cb: Callback) {
    if (isProperId(msg.id)) {
      this.callbacks[msg.id] = cb;
    }
    this.sendWithProtocolId(msg);
  }
}

const PROTOCOL_ID = 'UNIVERSAL_LOGIN';

const isProperId = (id: unknown) => typeof id === 'number';
