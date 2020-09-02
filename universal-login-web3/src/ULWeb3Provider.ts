import {Provider, JsonRPCRequest, Callback, JsonRPCResponse} from 'web3/providers';
import {Config, getConfigForNetwork} from './config';
import UniLoginSdk, {WalletService, SdkConfig} from '@unilogin/sdk';
import {UIController} from './services/UIController';
import {providers, utils} from 'ethers';
import {DEFAULT_GAS_LIMIT, ensure, walletFromBrain, asPartialMessage, Network, InitializationHandler, addressEquals, Message, PartialRequired} from '@unilogin/commons';
import {waitForTrue} from './ui/utils/utils';
import {getOrCreateUlButton, initUi} from './ui/initUi';
import {ULWeb3RootProps} from './ui/react/ULWeb3Root';
import {StorageService, BrowserChecker} from '@unilogin/react';
import {flatMap, map, Property, State} from 'reactive-properties';
import {renderLogoButton} from './ui/logoButton';
import {asBoolean, asString, cast} from '@restless/sanitizers';

export interface ULWeb3ProviderOptions extends Config {
  sdkConfigOverrides?: Partial<SdkConfig>;
  uiInitializer?: (services: ULWeb3RootProps) => void;
  browserChecker?: BrowserChecker;
  disabledDialogs?: string[];
}

export class ULWeb3Provider implements Provider {
  static getDefaultProvider(networkOrConfig: Network | Config, disabledDialogs: string[], sdkConfigOverrides?: Partial<SdkConfig>) {
    const config = typeof networkOrConfig === 'string' ? getConfigForNetwork(networkOrConfig) : networkOrConfig;

    return new ULWeb3Provider({
      disabledDialogs,
      ...config,
      sdkConfigOverrides,
    });
  }

  readonly isUniLogin = true;

  private readonly initHandler = new InitializationHandler(() => this._init(), () => this._finalizeAndStop());
  private readonly provider: Provider;
  private readonly sdk: UniLoginSdk;
  private readonly walletService: WalletService;
  private readonly uiController: UIController;
  private readonly browserChecker: BrowserChecker;
  private readonly network: Network;

  readonly isLoggedIn: Property<boolean>;
  readonly isUiVisible: Property<boolean>;
  readonly hasNotifications: Property<boolean>;

  constructor({
    network,
    provider,
    relayerUrl,
    ensDomains,
    sdkConfigOverrides,
    uiInitializer = initUi,
    observedTokensAddresses,
    browserChecker = new BrowserChecker(),
    disabledDialogs,
  }: ULWeb3ProviderOptions) {
    const sdkConfig = {
      network,
      observedTokensAddresses,
      storageService: new StorageService(),
      ...sdkConfigOverrides,
    };
    this.provider = provider;
    this.network = network;
    this.sdk = new UniLoginSdk(
      relayerUrl,
      new providers.Web3Provider(this.provider as any),
      sdkConfig,
    );
    this.browserChecker = browserChecker;
    this.walletService = new WalletService(this.sdk, walletFromBrain, sdkConfig.storageService);

    this.uiController = new UIController(this.walletService, disabledDialogs);

    this.isLoggedIn = this.walletService.walletDeployed;
    this.isUiVisible = this.uiController.isUiVisible;
    this.hasNotifications = this.walletService.stateProperty.pipe(
      flatMap(state => state.kind === 'Deployed' || state.kind === 'DeployedWithoutEmail' ? state.wallet.authorizations : new State([])),
      map(authorizations => authorizations.length > 0),
    );

    uiInitializer({
      sdk: this.sdk,
      domains: ensDomains,
      walletService: this.walletService,
      uiController: this.uiController,
    });
  }

  init() {
    return this.initHandler.initialize();
  }

  private async _init() {
    this.uiController.initializeApp();
    if (this.browserChecker.isLocalStorageBlocked()) {
      this.uiController.showLocalStorageWarning();
      return;
    }
    await this.sdk.start();
    await this.walletService.loadFromStorage();
    this.uiController.finishAppInitialization();
  }

  async send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    await this.init();
    if (methodsRequiringAccount.includes(payload.method)) await this.deployIfNoWalletDeployed();

    try {
      const handledPayload = await this.handle(payload);
      callback(null, {
        id: payload.id,
        jsonrpc: '2.0',
        ...handledPayload,
      });
    } catch (err) {
      this.uiController.showError(err.message);
      callback(err);
    }
  }

  private async handle(payload: JsonRPCRequest): Promise<any> {
    const method: string = payload.method;
    const params: unknown[] = payload.params;
    switch (method) {
      case 'eth_sendTransaction':
        const tx = cast(params[0], asPartialMessage);
        return this.sendTransaction(tx as PartialRequired<Message, 'to' | 'from'>);
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return {result: this.getAccounts()};
      case 'eth_sign': {
        const address = cast(params[0], asString);
        const message = cast(params[1], asString);
        return this.sign(address, message);
      }
      case 'personal_sign': {
        const address = cast(params[1], asString);
        const message = cast(params[0], asString);
        return this.sign(address, message);
      }
      case 'ul_set_dashboard_visibility':
        const isVisible = cast(params[0], asBoolean);
        this.uiController.setDashboardVisibility(isVisible);
        break;
      case 'ul_disconnect':
        await this.finalizeAndStop();
        break;
      case 'net_version':
        return {result: Network.toNumericId(this.network).toString()};
      default:
        return {result: await this.sendUpstream(payload)};
    }
  }

  private sendUpstream(payload: JsonRPCRequest): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.provider.send(payload, ((err: Error | null, result: JsonRPCResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.result);
        }
      }) as any);
    });
  }

  getAccounts() {
    if (this.walletService.walletDeployed.get()) {
      return [this.walletService.getDeployedWallet().contractAddress];
    } else {
      return [];
    }
  }

  async sendTransaction(transaction: PartialRequired<Message, 'to'| 'from'>): Promise<{result?: string, error?: string}> {
    const transactionWithDefaults = {gasLimit: DEFAULT_GAS_LIMIT, value: '0', ...transaction};
    const confirmationResponse = await this.uiController.confirmRequest('Confirm transaction', transactionWithDefaults);
    if (!confirmationResponse.isConfirmed) {
      return {error: 'Unilogin Transaction confirmation: User denied transaction'};
    }
    const transactionWithGasParameters = {...transactionWithDefaults, ...confirmationResponse.gasParameters};
    this.uiController.showWaitForTransaction();
    await this.deployIfNoWalletDeployed();
    const execution = await this.walletService.getDeployedWallet().execute(transactionWithGasParameters);

    const {transactionHash} = await execution.waitForTransactionHash();
    if (!transactionHash) {
      throw new Error('Expected tx hash to not be null');
    }
    this.uiController.showTransactionHash(transactionHash);
    execution.waitToBeSuccess().then(() => this.uiController.hideWaitForTransaction());
    return {result: transactionHash};
  }

  private getDecodedMessage(message: string) {
    try {
      return utils.toUtf8String(message);
    } catch {
      return message;
    }
  }

  async sign(address: string, message: string) {
    const decodedMessage = this.getDecodedMessage(message);
    if (!await this.uiController.signChallenge('Sign message', decodedMessage)) {
      return {error: 'UniLogin message signature: User denied message signature'};
    }
    await this.deployIfNoWalletDeployed();

    const wallet = this.walletService.getDeployedWallet();
    ensure(addressEquals(wallet.contractAddress, address), Error, `Address ${address} is not available to sign`);

    return {result: await wallet.signMessage(utils.arrayify(message))};
  }

  async initOnboarding() {
    if (this.uiController.activeModal.get().kind === 'WARNING_LOCAL_STORAGE') {
      return;
    }
    this.uiController.requireWallet();

    await waitForTrue(this.isLoggedIn);
    this.uiController.finishOnboarding();
  }

  private async deployIfNoWalletDeployed() {
    if (!this.walletService.walletDeployed.get()) {
      await this.initOnboarding();
    }
  }

  initWeb3Button(styles?: Record<string, string>) {
    const element = getOrCreateUlButton(styles);
    renderLogoButton(element, this.walletService);
  }

  finalizeAndStop() {
    return this.initHandler.finalize();
  }

  private _finalizeAndStop() {
    this.walletService.finalize();
    return this.sdk.finalizeAndStop();
  }
}

export const methodsRequiringAccount = [
  'ul_set_dashboard_visibility',
  'eth_sendTransaction',
  'eth_sendRawTransaction',
  'eth_sign',
  'personal_sign',
  'eth_requestAccounts',
];
