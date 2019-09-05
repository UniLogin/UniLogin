import {Provider} from 'web3/providers';
import {providers} from 'ethers';
import UniversalLoginSDK from '@universal-login/sdk';
import {initUi} from './ui';

interface JsonRPCRequest {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
}

interface JsonRPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: string;
}

interface Callback<ResultType> {
  (error: Error): void;

  (error: null, val: ResultType): void;
}

const WALLET = {
  name: 'user6.poppularapp.test',
  contractAddress: '0x2bc65e3Bb5D6bAbd6342489aacFecCaB64167835',
  privateKey: '0x313758209e20726adfa2fbacf1d2951a3b1ec01ac702604d09cf982944e54300',
};

export class ULWeb3Provider implements Provider {
  private sdk: UniversalLoginSDK;

  constructor(
    private provider: Provider,
  ) {
    this.sdk = new UniversalLoginSDK(
      'https://relayer-rinkeby.herokuapp.com',
      new providers.Web3Provider(this.provider as any),
    );

    initUi({
      sdk: this.sdk,
      domains: ['popularapp.test'],
      onCreate: (wallet) => console.log('wallet created', wallet),
    });
  }

  send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): any {
    console.log(payload);
    switch (payload.method) {
      case 'eth_sendTransaction':
        const tx = payload.params[0];
        this.sdk.execute(tx, WALLET.privateKey)
          .then(async (ex) => {
            const mined = await ex.waitToBeMined();
            callback(null, {
              id: payload.id,
              jsonrpc: '2.0',
              result: mined.transactionHash,
            });
          });
        break;
      case 'eth_accounts':
        callback(null, {
          id: payload.id,
          jsonrpc: '2.0',
          result: [WALLET.contractAddress],
        });
        break;
      default:
        return this.provider.send(payload, callback);
    }
  }
}
