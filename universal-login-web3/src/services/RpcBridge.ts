import {asAnyOf, asExactly, asNumber, asObject, asOptional, castOr, Result} from '@restless/sanitizers';

export type Callback = (error: any, response: any) => void;

export type Handler = (msg: any, cb: Callback) => void;

export class RpcBridge {
  private nextId = 0;
  private readonly callbacks: Record<number, Callback | undefined> = {};

  constructor(
    private readonly sendMessage: (msg: any) => void,
    private readonly handler: Handler,
  ) {}

  handleMessage(msg: unknown) {
    const result = castOr(msg, asRpcMessage, undefined);
    if (result) {
      this.handleRpc(result);
    }
  }

  send(msg: unknown, cb: Callback) {
    const id = this.getId();
    this.callbacks[id] = cb;
    this.sendRpc({
      protocolId: 'UNIVERSAL_LOGIN',
      id,
      isRequest: true,
      payload: msg,
    });
  }

  private getId() {
    return this.nextId++;
  }

  private handleRpc(rpc: RpcRequest | RpcResponse) {
    if (rpc.isRequest) {
      this.handleRequest(rpc);
    } else {
      this.handleResponse(rpc);
    }
  }

  private handleResponse(rpc: RpcResponse) {
    const cb = this.callbacks[rpc.id];
    delete this.callbacks[rpc.id];
    if (rpc.error !== undefined) {
      cb?.(rpc.error, undefined);
    } else {
      cb?.(null, rpc.response);
    }
  }

  private handleRequest(rpc: RpcRequest) {
    this.handler(rpc.payload, this.getCallbackHandler(rpc.id));
  }

  private getCallbackHandler(id: number) {
    return (error: any, response: any) => {
      if (error) {
        this.sendRpc({
          protocolId: 'UNIVERSAL_LOGIN',
          id,
          isRequest: false,
          error,
        });
      } else {
        this.sendRpc({
          protocolId: 'UNIVERSAL_LOGIN',
          id,
          isRequest: false,
          response,
        });
      }
    };
  }

  private sendRpc(rpc: RpcRequest | RpcResponse) {
    this.sendMessage(rpc);
  }
}

interface RpcRequest {
  protocolId: 'UNIVERSAL_LOGIN';
  id: number;
  isRequest: true;
  payload: unknown;
}

interface RpcResponse {
  protocolId: 'UNIVERSAL_LOGIN';
  id: number;
  isRequest: false;
  error?: unknown;
  response?: unknown;
}

const asRpcMessage = asAnyOf([
  asObject<RpcRequest>({
    protocolId: asExactly('UNIVERSAL_LOGIN'),
    id: asNumber,
    isRequest: asExactly(true),
    payload: Result.ok,
  }),
  asObject<RpcResponse>({
    protocolId: asExactly('UNIVERSAL_LOGIN'),
    id: asNumber,
    isRequest: asExactly(false),
    error: asOptional(Result.ok),
    response: asOptional(Result.ok),
  }),
], 'RpcMessage');
