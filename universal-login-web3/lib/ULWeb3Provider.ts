import {Provider} from 'web3/providers';
import {Config, getConfigForNetwork, Network} from './config';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {MetamaskService} from './services/MetamaskService';
import {UIController} from './services/UIController';
import {initUi} from './ui';
import {providers, utils} from 'ethers';
import {Callback, JsonRPCRequest, JsonRPCResponse} from './models/rpc';
import {ensure, Message} from '@universal-login/commons';
import {waitFor} from './utils';

export class ULWeb3Provider implements Provider {
  static getDefaultProvider(networkOrConfig: Network | Config) {
    const config = typeof networkOrConfig === 'string' ? getConfigForNetwork(networkOrConfig) : networkOrConfig;

    return new ULWeb3Provider(
      config.provider,
      config.relayerUrl,
      config.ensDomains,
    );
  }

  private readonly sdk: UniversalLoginSDK;
  private readonly walletService: WalletService;
  private readonly metamaskService: MetamaskService;
  private readonly uiController: UIController;

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
    this.metamaskService = new MetamaskService();
    this.uiController = new UIController(this.walletService, this.metamaskService);

    uiInitializer({
      sdk: this.sdk,
      domains: ensDomains,
      walletService: this.walletService,
      uiController: this.uiController,
      metamaskService: this.metamaskService,
    });
  }

  send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): any {
    const metamaskProvider = this.metamaskService.metamaskProvider.get();
    if (metamaskProvider) {
      return metamaskProvider.sendAsync(payload, callback);
    }

    switch (payload.method) {
      case 'eth_sendTransaction':
      case 'eth_accounts':
      case 'eth_sign':
        try {
          this.handle(payload.method, payload.params).then((result: any) => {
            callback(null, {
              id: payload.id,
              jsonrpc: '2.0',
              result,
            });
          });
        } catch (err) {
          callback(err);
        }
        break;
      default:
        return this.provider.send(payload, callback as any);
    }
  }

  async handle(method: string, params: any[]): Promise<any> {
    switch (method) {
      case 'eth_sendTransaction':
        const tx = params[0];
        return this.sendTransaction(tx);
      case 'eth_accounts':
        return this.getAccounts();
      case 'eth_sign':
        return this.sign(params[0], params[1]);
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

  async sign(address: string, message: string): Promise<string> {
    const wallet = await this.walletService.getDeployedWallet();
    ensure(wallet.contractAddress !== address, Error, `Address ${address} is not available to sign`);

    const signingKey = new utils.SigningKey(wallet.privateKey);
    const signature = signingKey.signDigest(
      utils.hashMessage(utils.arrayify(message)),
    );
    return utils.joinSignature(signature);
  }

  create() {
    this.uiController.requireWallet();
  }
}
