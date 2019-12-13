import {Provider, Callback, JsonRPCResponse, JsonRPCRequest} from 'web3/providers';
import {Web3Picker} from '.';
import {Web3ProviderFactory} from './Web3ProviderFactory';

export class Web3Strategy implements Provider {
  public web3picker = new Web3Picker(this);
  public currentProvider : Provider = this.web3picker;

  constructor(public readonly factories: Web3ProviderFactory[]) {
  }

  send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    this.currentProvider.send(payload, callback)
  }
}