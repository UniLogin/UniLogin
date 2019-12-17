import {Provider, Callback, JsonRPCResponse, JsonRPCRequest} from 'web3/providers';
import {Web3Picker} from '.';
import {Web3ProviderFactory} from './models/Web3ProviderFactory';

export class Web3Strategy implements Provider {
  web3picker: Web3Picker;
  currentProvider: Provider;
  providerName: string;

  constructor(public readonly factories: Web3ProviderFactory[], public readProvider: Provider) {
    console.log('Create Web3Strategy');
    this.web3picker = new Web3Picker(this, factories);
    this.currentProvider = this.web3picker;
    this.providerName = 'Web3Picker';
  }

  send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    console.log(payload.method);
    switch (payload.method) {
      case 'eth_sendTransaction':
      case 'eth_sendRawTransaction':
      case 'eth_accounts':
      case 'eth_sign':
      case 'personal_sign':
        return this.currentProvider.send(payload, callback);
      default:
        return this.readProvider.send(payload, callback);
    }
  }
}
