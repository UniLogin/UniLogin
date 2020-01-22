import {Provider} from 'web3/providers';
import {Config, getConfigForNetwork, Network} from './config';
import UniversalLoginSDK, {WalletService, setBetaNotice} from '@universal-login/sdk';
import {UIController} from './services/UIController';
import {providers, utils, constants} from 'ethers';
import {Callback, JsonRPCRequest, JsonRPCResponse} from './models/rpc';
import {ensure, Message, walletFromBrain, ApplicationInfo, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
import {waitForTrue} from './ui/utils/utils';
import {initUi} from './ui/utils/initUi';
import {ULWeb3RootProps} from './ui/react/ULWeb3Root';
import {StorageService, WalletStorageService} from '@universal-login/react';
import {Property} from 'reactive-properties';
import {renderLogoButton} from './ui/logoButton';

export interface ULWeb3ProviderOptions {
  provider: Provider;
  relayerUrl: string;
  ensDomains: string[];
  applicationInfo?: ApplicationInfo;
  uiInitializer?: (services: ULWeb3RootProps) => void;
  storageService?: StorageService;
}

export class ULWeb3Provider implements Provider {
  static getDefaultProvider(networkOrConfig: Network | Config, applicationInfo?: ApplicationInfo) {
    const config = typeof networkOrConfig === 'string' ? getConfigForNetwork(networkOrConfig) : networkOrConfig;

    return new ULWeb3Provider({
      provider: config.provider,
      relayerUrl: config.relayerUrl,
      ensDomains: config.ensDomains,
      applicationInfo,
    });
  }

  readonly isUniversalLogin = true;

  private readonly provider: Provider;
  private readonly sdk: UniversalLoginSDK;
  private readonly walletService: WalletService;
  private readonly uiController: UIController;

  readonly isLoggedIn: Property<boolean>;

  constructor({
    provider,
    relayerUrl,
    ensDomains,
    applicationInfo,
    uiInitializer = initUi,
    storageService = new StorageService(),
  }: ULWeb3ProviderOptions) {
    this.provider = provider;
    this.sdk = new UniversalLoginSDK(
      relayerUrl,
      new providers.Web3Provider(this.provider as any),
      applicationInfo && {applicationInfo},
    );
    const walletStorageService = new WalletStorageService(storageService);
    this.walletService = new WalletService(this.sdk, walletFromBrain, walletStorageService);

    this.uiController = new UIController(this.walletService);

    this.isLoggedIn = this.walletService.isAuthorized;

    uiInitializer({
      sdk: this.sdk,
      domains: ensDomains,
      walletService: this.walletService,
      uiController: this.uiController,
    });
  }

  async init() {
    await this.sdk.start();
    setBetaNotice(this.sdk);
    this.walletService.loadFromStorage();
  }

  async send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    if (this.walletService.state.kind !== 'Deployed') {
      await this.initOnboarding();
    }

    switch (payload.method) {
      case 'eth_sendTransaction':
      case 'eth_accounts':
      case 'eth_sign':
      case 'personal_sign':
        try {
          const result = await this.handle(payload.method, payload.params);
          callback(null, {
            id: payload.id,
            jsonrpc: '2.0',
            result,
          });
        } catch (err) {
          callback(err);
        }
        break;
      default:
        return this.provider.send(payload, callback);
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
      case 'personal_sign':
        return this.sign(params[1], params[0]);
      default:
        throw new Error(`Method not supported: ${method}`);
    }
  }

  getAccounts() {
    if (this.walletService.walletDeployed.get()) {
      return [this.walletService.getDeployedWallet().contractAddress];
    } else {
      return [];
    }
  }

  async sendTransaction(transaction: Partial<Message>): Promise<string> {
    if (!await this.uiController.confirmRequest('Confirm transaction')) {
      return constants.HashZero;
    };
    this.uiController.showWaitForTransaction();
    await this.ensureWalletIsDeployed();
    const transactionWithDefaults = {gasLimit: DEFAULT_GAS_LIMIT, ...transaction};
    const execution = await this.walletService.getDeployedWallet().execute(transactionWithDefaults);

    const succeeded = await execution.waitForTransactionHash();
    if (!succeeded.transactionHash) {
      this.uiController.hideModal();
      throw new Error('Expected tx hash to not be null');
    }
    this.uiController.showWaitForTransaction(succeeded.transactionHash);
    await execution.waitToBeSuccess();
    this.uiController.hideModal();
    return succeeded.transactionHash;
  }

  async sign(address: string, message: string) {
    if (!await this.uiController.confirmRequest('Do you want sign challenge?')) {
      return constants.HashZero;
    }
    await this.ensureWalletIsDeployed();

    const wallet = this.walletService.getDeployedWallet();
    ensure(wallet.contractAddress !== address, Error, `Address ${address} is not available to sign`);

    return wallet.signMessage(utils.arrayify(message));
  }

  async initOnboarding() {
    this.uiController.requireWallet();

    await waitForTrue(this.isLoggedIn);
    this.uiController.finishOnboarding();
  }

  private async ensureWalletIsDeployed() {
    if (!this.walletService.walletDeployed.get()) {
      this.uiController.requireWallet();
      await waitForTrue(this.walletService.walletDeployed);
    }
  }

  initWeb3Button(element: Element) {
    renderLogoButton(element, this.walletService);
  }

  finalizeAndStop() {
    return this.sdk.finalizeAndStop();
  }
}
