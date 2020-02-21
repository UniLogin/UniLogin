import {Provider} from 'web3/providers';
import {Config, getConfigForNetwork, Network} from './config';
import UniversalLoginSDK, {WalletService, setBetaNotice} from '@unilogin/sdk';
import {UIController} from './services/UIController';
import {providers, utils, constants} from 'ethers';
import {Callback, JsonRPCRequest, JsonRPCResponse} from './models/rpc';
import {ensure, Message, walletFromBrain, ApplicationInfo, DEFAULT_GAS_LIMIT, Nullable} from '@unilogin/commons';
import {waitForTrue} from './ui/utils/utils';
import {initUi} from './ui/initUi';
import {ULWeb3RootProps} from './ui/react/ULWeb3Root';
import {StorageService} from '@unilogin/react';
import {Property, State} from 'reactive-properties';
import {renderLogoButton} from './ui/logoButton';
import {getOrCreateUlButton} from './ui/initUi';

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

  readonly isUniLogin = true;

  private readonly provider: Provider;
  private readonly sdk: UniversalLoginSDK;
  private readonly walletService: WalletService;
  private readonly uiController: UIController;
  private unsubscribeNotifications: Nullable<Function> = null;

  readonly isLoggedIn: Property<boolean>;
  readonly isUiVisible: Property<boolean>;
  readonly hasNotifications: State<boolean> = new State(false);

  constructor({
    provider,
    relayerUrl,
    ensDomains,
    applicationInfo,
    uiInitializer = initUi,
    storageService = new StorageService(),
  }: ULWeb3ProviderOptions) {
    this.provider = provider;
    const sdkConfig = {
      storageService: new StorageService(),
      applicationInfo,
    };
    this.sdk = new UniversalLoginSDK(
      relayerUrl,
      new providers.Web3Provider(this.provider as any),
      sdkConfig,
    );
    this.walletService = new WalletService(this.sdk, walletFromBrain, storageService);

    this.uiController = new UIController(this.walletService);

    this.isLoggedIn = this.walletService.isAuthorized;
    this.isUiVisible = this.uiController.isUiVisible;

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
    if (this.isLoggedIn.get()) {
      this.unsubscribeNotifications = await this.subscribeNotifications();
    }
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
      case 'ul_set_dashboard_visibility':
      case 'eth_requestAccounts':
        try {
          const result = await this.handle(payload.method, payload.params);
          callback(null, {
            id: payload.id,
            jsonrpc: '2.0',
            result,
          });
        } catch (err) {
          this.uiController.showError(err.message);
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
      case 'eth_requestAccounts':
        return this.getAccounts();
      case 'eth_sign':
        return this.sign(params[0], params[1]);
      case 'personal_sign':
        return this.sign(params[1], params[0]);
      case 'ul_set_dashboard_visibility':
        this.uiController.setDashboardVisibility(!!params[0]);
        break;
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
    const transactionWithDefaults = {gasLimit: DEFAULT_GAS_LIMIT, ...transaction};
    const confirmationResponse = await this.uiController.confirmRequest('Confirm transaction', transactionWithDefaults);
    if (!confirmationResponse.isConfirmed) {
      return constants.HashZero;
    };
    const transactionWithGasParameters = {...transactionWithDefaults, ...confirmationResponse.gasParameters};
    this.uiController.showWaitForTransaction();
    await this.deployIfNoWalletDeployed();
    const execution = await this.walletService.getDeployedWallet().execute(transactionWithGasParameters);

    const succeeded = await execution.waitForTransactionHash();
    if (!succeeded.transactionHash) {
      throw new Error('Expected tx hash to not be null');
    }
    this.uiController.showWaitForTransaction(succeeded.transactionHash);
    await execution.waitToBeSuccess();
    this.uiController.hideModal();
    return succeeded.transactionHash;
  }

  async sign(address: string, message: string) {
    const decodedMessage = utils.toUtf8String(message);
    if (!await this.uiController.signChallenge('Sign message', decodedMessage)) {
      return constants.HashZero;
    }
    await this.deployIfNoWalletDeployed();

    const wallet = this.walletService.getDeployedWallet();
    ensure(wallet.contractAddress !== address, Error, `Address ${address} is not available to sign`);

    return wallet.signMessage(utils.arrayify(message));
  }

  async initOnboarding() {
    this.uiController.requireWallet();

    await waitForTrue(this.isLoggedIn);
    this.uiController.finishOnboarding();
    this.unsubscribeNotifications = await this.subscribeNotifications();
  }

  private async deployIfNoWalletDeployed() {
    if (!this.walletService.walletDeployed.get()) {
      this.uiController.requireWallet();
      await waitForTrue(this.walletService.walletDeployed);
    }
  }

  private async subscribeNotifications() {
    await waitForTrue(this.isLoggedIn);
    return this.walletService.getDeployedWallet().subscribeAuthorisations((notifications: Notification[]) => this.setHasNotifications(notifications.length > 0));
  }

  private setHasNotifications(hasNotifications: boolean) {
    this.hasNotifications.set(hasNotifications);
  }

  initWeb3Button(styles?: Record<string, string>) {
    const element = getOrCreateUlButton(styles);
    renderLogoButton(element as Element, this.walletService);
  }

  finalizeAndStop() {
    this.unsubscribeNotifications?.();
    return this.sdk.finalizeAndStop();
  }
}
