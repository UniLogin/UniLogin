import {Provider} from 'web3/providers';
import {providers} from 'ethers';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {initUi} from './ui';
import {UIController} from './services/UIController';
import {Message} from '@universal-login/commons';
import {Callback, JsonRPCRequest, JsonRPCResponse} from './models/rpc';
import {waitFor} from './utils';
import {Config, getConfigForNetwork, Network} from './config';
import {MetamaskService} from './services/MetamaskService';

export class ULWeb3Provider implements Provider {
  static getDefaultProvider(networkOrConfig: Network | Config) {
    const config = typeof networkOrConfig === 'string' ? getConfigForNetwork(networkOrConfig) : networkOrConfig;

    return new ULWeb3Provider(
      config.provider,
      config.relayerUrl,
      config.ensDomains,
    );
  }

  private sdk: UniversalLoginSDK;
  private walletService: WalletService;
  private uiController: UIController;
  private metamaskService: MetamaskService;

  constructor(
    private provider: Provider,
    relayerUrl: string,
    ensDomains: string[],
    uiInitializer = initUi,
  ) {
    this.sdk = new UniversalLoginSDK(
      relayerUrl,
      new providers.Web3Provider(this.provider as any),
    );
    this.walletService = new WalletService(this.sdk);
    this.uiController = new UIController(this.walletService);
    this.metamaskService = new MetamaskService();

    uiInitializer({
      sdk: this.sdk,
      domains: ensDomains,
      walletService: this.walletService,
      uiController: this.uiController,
      metamaskService: this.metamaskService,
    });
  }

  send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): any {
    function respond(result: any) {
      callback(null, {
        id: payload.id,
        jsonrpc: '2.0',
        result,
      });
    }

    switch (payload.method) {
      case 'eth_sendTransaction':
        const tx = payload.params[0];
        this.sendTransaction(tx).then((hash) => respond(hash));
        break;
      case 'eth_accounts':
        respond(this.getAccounts());
        break;
      default:
        return this.provider.send(payload, callback as any);
    }
  }

  getAccounts() {
    if (this.walletService.walletDeployed.get()) {
      return [this.walletService.getDeployedWallet().contractAddress];
    } else {
      return [];
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
    const succeeded = await execution.waitForTransactionHash();
    if (!succeeded.transactionHash) {
      throw new Error('Expected tx hash to not be null');
    }
    return succeeded.transactionHash;
  }

  create() {
    this.uiController.requireWallet();
  }
}
