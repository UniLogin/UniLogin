import {Provider, JsonRPCRequest, Callback, JsonRPCResponse} from 'web3/providers';

export interface BrowserWeb3Provider extends Provider {
  enable: () => Promise<void>;
  sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;
  selectedAddress: string;
}
