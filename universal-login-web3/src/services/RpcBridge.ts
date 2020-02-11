export type Callback = (error: any, response: any) => void;

export type Handler = (msg: any, cb: Callback) => void;

export class RpcBridge {
  private readonly callbacks: Record<number, Set<Callback> | undefined> = {};

  constructor(
    private readonly sendMessage: (msg: any) => void,
    private readonly handler: Handler,
  ) {}

  handleMessage(msg: any) {
    if (msg !== undefined && msg.protocolId === PROTOCOL_ID && msg.payload !== undefined) {
      this.handleRpc(msg.payload);
    }
  }

  private handleRpc(rpc: any) {
    console.log('bridge.handleRpc', rpc)
    if (rpc.method !== undefined) {
      this.handleRequest(rpc);
    } else if (isProperId(rpc.id)) {
      this.handleResponse(rpc);
    } else if (rpc.error !== undefined && isProperId(rpc.id)) {
      this.handleErrorResponse(rpc);
    }
  }

  private handleErrorResponse(rpc: any) {
    this.handler(rpc, this.getCallbackHandler(rpc.id));
  }

  private handleResponse(rpc: any) {
    if (rpc.error !== undefined) {
      this.notify(rpc.id, rpc.error, undefined);
    } else {
      this.notify(rpc.id, null, rpc);
    }
  }

  private handleRequest(rpc: any) {
    this.handler(rpc, this.getCallbackHandler(isProperId(rpc.id) ? rpc.id : null));
  }

  private notify(id: number, error: any, response: any) {
    this.callbacks[id]?.forEach(cb => cb(error, response));
  }

  private getCallbackHandler(id: number) {
    return (error: any, response: any) => {
      console.log('bridge.callbackHandler', error, response)
      if (error) {
        this.sendWithProtocolId({jsonrpc: '2.0', error: error, id});
      } else {
        this.sendWithProtocolId(response);
      }
    };
  }

  private sendWithProtocolId(payload: any) {
    this.sendMessage({
      protocolId: PROTOCOL_ID,
      payload,
    });
  }

  send(msg: any, cb: Callback) {
    if (isProperId(msg.id)) {
      (this.callbacks[msg.id] = this.callbacks[msg.id] ?? new Set()).add(cb);
    }
    this.sendWithProtocolId(msg);
  }
}

const PROTOCOL_ID = 'UNIVERSAL_LOGIN';

const isProperId = (id: unknown) => typeof id === 'number';
