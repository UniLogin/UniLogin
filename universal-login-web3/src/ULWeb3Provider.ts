import {Provider} from 'web3/providers';
import {Config, getConfigForNetwork, Network} from './config';
import UniversalLoginSDK, {WalletService, setBetaNotice, SdkConfig} from '@unilogin/sdk';
import {UIController} from './services/UIController';
import {constants, providers, utils} from 'ethers';
import {Callback, JsonRPCRequest, JsonRPCResponse} from './models/rpc';
import {ApplicationInfo, DEFAULT_GAS_LIMIT, ensure, Message, walletFromBrain, asPartialMessage} from '@unilogin/commons';
import {waitForTrue} from './ui/utils/utils';
import {getOrCreateUlButton, initUi} from './ui/initUi';
import {ULWeb3RootProps} from './ui/react/ULWeb3Root';
import {StorageService} from '@unilogin/react';
import {flatMap, map, Property, State} from 'reactive-properties';
import {renderLogoButton} from './ui/logoButton';
import {asBoolean, asString, cast} from '@restless/sanitizers';

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

  readonly isLoggedIn: Property<boolean>;
  readonly isUiVisible: Property<boolean>;
  readonly hasNotifications: Property<boolean>;

  constructor({
    provider,
    relayerUrl,
    ensDomains,
    applicationInfo,
    uiInitializer = initUi,
    storageService = new StorageService(),
  }: ULWeb3ProviderOptions) {
    this.provider = provider;
    const sdkConfig: Partial<SdkConfig> = {storageService};
    if (applicationInfo) {
      sdkConfig.applicationInfo = applicationInfo;
    }
    this.sdk = new UniversalLoginSDK(
      relayerUrl,
      new providers.Web3Provider(this.provider as any),
      sdkConfig,
    );
    this.walletService = new WalletService(this.sdk, walletFromBrain, storageService);

    this.uiController = new UIController(this.walletService);

    this.isLoggedIn = this.walletService.isAuthorized;
    this.isUiVisible = this.uiController.isUiVisible;
    this.hasNotifications = this.walletService.stateProperty.pipe(
      flatMap(state => state.kind === 'Deployed' ? state.wallet.authorizations : new State([])),
      map(authorizations => authorizations.length > 0),
    );

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

    try {
      const result = await this.handle(payload);
      callback(null, {
        id: payload.id,
        jsonrpc: '2.0',
        result,
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
        return this.sendTransaction(tx);
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return this.getAccounts();
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
      default:
        return this.sendUpstream(payload);
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

  async sendTransaction(transaction: Partial<Message>): Promise<string> {
    const transactionWithDefaults = {gasLimit: DEFAULT_GAS_LIMIT, value: '0', ...transaction};
    const confirmationResponse = await this.uiController.confirmRequest('Confirm transaction', transactionWithDefaults);
    if (!confirmationResponse.isConfirmed) {
      return constants.HashZero;
    }
    const transactionWithGasParameters = {...transactionWithDefaults, ...confirmationResponse.gasParameters};
    this.uiController.showWaitForTransaction();
    await this.deployIfNoWalletDeployed();
    const execution = await this.walletService.getDeployedWallet().execute(transactionWithGasParameters);

    const succeeded = await execution.waitForTransactionHash();
    if (!succeeded.transactionHash) {
      throw new Error('Expected tx hash to not be null');
    }
    if (this.uiController.activeModal.get().kind === 'WAIT_FOR_TRANSACTION') {
      this.uiController.showWaitForTransaction(succeeded.transactionHash);
    }
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
  }

  private async deployIfNoWalletDeployed() {
    if (!this.walletService.walletDeployed.get()) {
      this.uiController.requireWallet();
      await waitForTrue(this.walletService.walletDeployed);
    }
  }

  initWeb3Button(styles?: Record<string, string>) {
    const element = getOrCreateUlButton(styles);
    renderLogoButton(element, this.walletService);
  }

  finalizeAndStop() {
    return this.sdk.finalizeAndStop();
  }
}
