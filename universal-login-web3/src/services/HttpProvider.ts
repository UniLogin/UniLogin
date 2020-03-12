import {Provider, JsonRPCRequest} from 'web3/providers';
import {providers} from 'ethers';

export class HttpProvider implements Provider {
  private readonly provider: providers.JsonRpcProvider;

  constructor(url: string) {
    this.provider = new providers.JsonRpcProvider(url);
  }

  send(payload: JsonRPCRequest, callback: any): any {
    this.provider.send(payload.method, payload.params)
      .then(
        result => {
          callback(null, {jsonrpc: '2.0', id: payload.id, result});
        },
        err => callback(err),
      );
  }
}
