import {Provider} from 'web3/providers';
import {providers} from 'ethers';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {initUi} from './ui';
import {Property} from 'reactive-properties';
import {UIController} from './services/UIController';
import {Message} from '@universal-login/commons';

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

export class ULWeb3Provider implements Provider {
  private sdk: UniversalLoginSDK;
  private walletService: WalletService;
  private uiController: UIController;

  constructor(
    private provider: Provider,
  ) {
    this.sdk = new UniversalLoginSDK(
      'https://relayer-rinkeby.herokuapp.com',
      new providers.Web3Provider(this.provider as any),
    );
    this.walletService = new WalletService(this.sdk);
    this.uiController = new UIController(this.walletService);

    this.walletService.stateProperty.subscribe(() => console.log(this.walletService.stateProperty.get()));

    initUi({
      sdk: this.sdk,
      domains: ['poppularapp.test'],
      walletService: this.walletService,
      uiController: this.uiController,
    });
  }

  send(payload: JsonRPCRequest, _callback: Callback<JsonRPCResponse>): any {
    const callback = (err: any, msg: any) => {
      console.log('<', msg);
      if (err) {
        console.log('err', err);
      }
      _callback(err, msg);
    };
    console.log('>', payload);
    switch (payload.method) {
      case 'eth_sendTransaction':
        const tx = payload.params[0];
        this.sendTransaction(tx)
          .then((hash) => callback(null, {
            id: payload.id,
            jsonrpc: '2.0',
            result: hash,
          }));
        break;
      case 'eth_accounts':
        callback(null, {
          id: payload.id,
          jsonrpc: '2.0',
          result: this.walletService.walletDeployed.get() ? [this.walletService.getDeployedWallet().contractAddress] : [],
        });
        break;
      default:
        return this.provider.send(payload, callback as any);
    }
  }

  async sendTransaction(tx: Partial<Message>): Promise<string> {
    if (!this.walletService.walletDeployed.get()) {
      this.uiController.requireWallet();
      await waitFor((x: boolean) => x)(this.walletService.walletDeployed);
    }
    return this.executeTransaction(tx);
  }

  async executeTransaction(tx: Partial<Message>): Promise<string> {
    const execution = await this.walletService.getDeployedWallet().execute(tx);
    const mined = await execution.waitToBeMined();
    if (!mined.transactionHash) {
      throw new Error('Expected tx hash to not be null');
    }
    return mined.transactionHash;
  }

  create() {
    this.uiController.requireWallet();
  }
}


function waitFor<T>(predicate: (value: T) => boolean): (prop: Property<T>) => Promise<void> {
  return (source) => new Promise((resolve) => {
    const unsubscribe = source.subscribe(() => {
      if (predicate(source.get())) {
        resolve();
        unsubscribe();
      }
    });
  });
}

