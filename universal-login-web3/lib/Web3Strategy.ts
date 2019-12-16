import {Provider, Callback, JsonRPCResponse, JsonRPCRequest} from 'web3/providers';
import {Web3Picker} from '.';
import {Web3ProviderFactory} from './models/Web3ProviderFactory';

export class Web3Strategy implements Provider {
  web3picker: Web3Picker;
  currentProvider: Provider;

  constructor(public readonly factories: Web3ProviderFactory[]) {
    this.web3picker = new Web3Picker(this, factories);
    this.currentProvider = this.web3picker;
  }

  send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    return this.currentProvider.send(payload, callback);
  }
}
