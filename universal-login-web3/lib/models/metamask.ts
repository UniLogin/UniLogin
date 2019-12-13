import {Callback, JsonRPCRequest, JsonRPCResponse} from './rpc';
import {Provider} from 'web3/providers';

export interface MetamaskEthereum extends Provider {
  enable: () => Promise<void>;
  sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;
  selectedAddress: string;
}
