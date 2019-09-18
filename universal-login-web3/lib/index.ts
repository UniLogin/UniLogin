import {Provider} from 'web3/providers';
import {providers} from 'ethers';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {initUi} from './ui';
import {UIController} from './services/UIController';
import {Message} from '@universal-login/commons';
import {Callback, JsonRPCRequest, JsonRPCResponse} from './models/rpc';
import {waitFor} from './utils';

export class ULWeb3Provider implements Provider {
  private sdk: UniversalLoginSDK;
  private walletService: WalletService;
  private uiController: UIController;

  constructor(
    private provider: Provider,
    relayerUrl: string,
    ensDomains: string[],
  ) {
    this.sdk = new UniversalLoginSDK(
      relayerUrl,
      new providers.Web3Provider(this.provider as any),
    );
    this.walletService = new WalletService(this.sdk);
    this.uiController = new UIController(this.walletService);

    initUi({
      sdk: this.sdk,
      domains: ensDomains,
      walletService: this.walletService,
      uiController: this.uiController,
    });
  }

  send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): any {
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
    const execution = await this.walletService.getDeployedWallet().execute({
      ...tx,
      from: this.walletService.getDeployedWallet().contractAddress,
    });
    const succeeded = await execution.waitToBeSuccess();
    if (!succeeded.transactionHash) {
      throw new Error('Expected tx hash to not be null');
    }
    return succeeded.transactionHash;
  }

  create() {
    this.uiController.requireWallet();
  }
}
