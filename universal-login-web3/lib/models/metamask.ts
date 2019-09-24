import {Callback, JsonRPCRequest, JsonRPCResponse} from './rpc';

export interface MetamaskEthereum {
  enable: () => Promise<void>;
  sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;
  selectedAddress: string;
}
