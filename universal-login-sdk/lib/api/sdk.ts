import {providers} from 'ethers';
import {
  addCodesToNotifications,
  BalanceChecker,
  createKeyPair,
  deepMerge,
  DeepPartial,
  ensure,
  ensureNotEmpty,
  ensureNotNull,
  generateCode,
  Message,
  SdkExecutionOptions,
  Notification,
  PublicRelayerConfig,
  resolveName,
  SignedMessage,
  signRelayerRequest,
  TokenDetailsService,
  TokensValueConverter,
  ETHER_NATIVE_TOKEN,
} from '@universal-login/commons';
import AuthorisationsObserver from '../core/observers/AuthorisationsObserver';
import BlockchainObserver from '../core/observers/BlockchainObserver';
import {RelayerApi} from '../integration/http/RelayerApi';
import {BlockchainService} from '../integration/ethereum/BlockchainService';
import {InvalidContract, InvalidEvent, InvalidGasLimit, MissingConfiguration, InvalidENSRecord} from '../core/utils/errors';
import {FutureWalletFactory, FutureWallet} from './FutureWalletFactory';
import {Execution, ExecutionFactory} from '../core/services/ExecutionFactory';
import {BalanceObserver, OnBalanceChange} from '../core/observers/BalanceObserver';
import {SdkConfigDefault} from '../config/SdkConfigDefault';
import {SdkConfig} from '../config/SdkConfig';
import {AggregateBalanceObserver, OnAggregatedBalanceChange} from '../core/observers/AggregateBalanceObserver';
import {OnTokenPricesChange, PriceObserver} from '../core/observers/PriceObserver';
import {TokensDetailsStore} from '../core/services/TokensDetailsStore';
import {messageToSignedMessage} from '@universal-login/contracts';
import {ensureSufficientGas} from '../core/utils/validation';
import {GasPriceOracle} from '../integration/ethereum/gasPriceOracle';
import {GasModeService} from '../core/services/GasModeService';
import {FeatureFlagsService} from '../core/services/FeatureFlagsService';
import {deprecateSDKMethod} from './deprecate';
import {DeployedWallet} from './DeployedWallet';

class UniversalLoginSDK {
  provider: providers.Provider;
  relayerApi: RelayerApi;
  authorisationsObserver: AuthorisationsObserver;
  blockchainObserver: BlockchainObserver;
  executionFactory: ExecutionFactory;
  balanceChecker: BalanceChecker;
  balanceObserver?: BalanceObserver;
  tokensValueConverter: TokensValueConverter;
  aggregateBalanceObserver?: AggregateBalanceObserver;
  priceObserver: PriceObserver;
  tokenDetailsService: TokenDetailsService;
  tokensDetailsStore: TokensDetailsStore;
  blockchainService: BlockchainService;
  gasPriceOracle: GasPriceOracle;
  gasModeService: GasModeService;
  futureWalletFactory?: FutureWalletFactory;
  sdkConfig: SdkConfig;
  relayerConfig?: PublicRelayerConfig;
  factoryAddress?: string;
  featureFlagsService: FeatureFlagsService;

  constructor(
    relayerUrl: string,
    providerOrUrl: string | providers.Provider,
    sdkConfig?: DeepPartial<SdkConfig>,
  ) {
    this.provider = typeof (providerOrUrl) === 'string'
      ? new providers.JsonRpcProvider(providerOrUrl, {chainId: 0} as any)
      : providerOrUrl;
    this.sdkConfig = deepMerge(SdkConfigDefault, sdkConfig);
    this.relayerApi = new RelayerApi(relayerUrl);
    this.authorisationsObserver = new AuthorisationsObserver(this.relayerApi, this.sdkConfig.authorizationsObserverTick);
    this.executionFactory = new ExecutionFactory(this.relayerApi, this.sdkConfig.executionFactoryTick);
    this.blockchainService = new BlockchainService(this.provider);
    this.blockchainObserver = new BlockchainObserver(this.blockchainService);
    this.balanceChecker = new BalanceChecker(this.provider);
    this.tokenDetailsService = new TokenDetailsService(this.provider);
    this.tokensDetailsStore = new TokensDetailsStore(this.tokenDetailsService, this.sdkConfig.observedTokensAddresses);
    this.priceObserver = new PriceObserver(this.tokensDetailsStore, this.sdkConfig.observedCurrencies, this.sdkConfig.priceObserverTick);
    this.gasPriceOracle = new GasPriceOracle(this.provider);
    this.tokensValueConverter = new TokensValueConverter(this.sdkConfig.observedCurrencies);
    this.gasModeService = new GasModeService(this.tokensDetailsStore, this.gasPriceOracle, this.priceObserver);
    this.featureFlagsService = new FeatureFlagsService();
  }

  private createDeployedWallet(walletContractAddress: string, privateKey = '') {
    return new DeployedWallet(walletContractAddress, '', privateKey, this);
  }

  getNotice() {
    return this.sdkConfig.notice;
  }

  setNotice(notice: string) {
    this.sdkConfig.notice = notice;
  }

  getFutureWalletFactory() {
    this.getRelayerConfig();
    this.fetchFutureWalletFactory();
    return this.futureWalletFactory!;
  }

  createFutureWallet(): Promise<FutureWallet> {
    return this.getFutureWalletFactory().createFutureWallet();
  }

  addKey(to: string, publicKey: string, privateKey: string, executionOptions: SdkExecutionOptions): Promise<Execution> {
    deprecateSDKMethod('addKey');
    return this.createDeployedWallet(to, privateKey).addKey(publicKey, executionOptions);
  }

  addKeys(to: string, publicKeys: string[], privateKey: string, executionOptions: SdkExecutionOptions): Promise<Execution> {
    deprecateSDKMethod('addKeys');
    return this.createDeployedWallet(to, privateKey).addKeys(publicKeys, executionOptions);
  }

  removeKey(to: string, key: string, privateKey: string, executionOptions: SdkExecutionOptions): Promise<Execution> {
    deprecateSDKMethod('removeKey');
    return this.createDeployedWallet(to, privateKey).removeKey(key, executionOptions);
  }

  setRequiredSignatures(to: string, requiredSignatures: number, privateKey: string, executionOptions: SdkExecutionOptions): Promise<Execution> {
    deprecateSDKMethod('setRequiredSignatures');
    return this.createDeployedWallet(to, privateKey).setRequiredSignatures(requiredSignatures, executionOptions);
  }

  async getMessageStatus(messageHash: string) {
    return this.relayerApi.getStatus(messageHash);
  }

  getRelayerConfig(): PublicRelayerConfig {
    ensureNotNull(this.relayerConfig, Error, 'Relayer configuration not yet loaded');
    return this.relayerConfig;
  }

  async fetchRelayerConfig() {
    if (!this.relayerConfig) {
      this.relayerConfig = (await this.relayerApi.getConfig()).config;
    }
  }

  async fetchBalanceObserver(contractAddress: string) {
    if (this.balanceObserver) {
      return;
    }
    ensureNotNull(contractAddress, InvalidContract);
    ensureNotEmpty(this.sdkConfig, MissingConfiguration);

    await this.tokensDetailsStore.fetchTokensDetails();
    this.balanceObserver = new BalanceObserver(this.balanceChecker, contractAddress, this.tokensDetailsStore, this.sdkConfig.balanceObserverTick);
  }

  async fetchAggregateBalanceObserver(contractAddress: string) {
    if (this.aggregateBalanceObserver) {
      return;
    }
    await this.fetchBalanceObserver(contractAddress);
    this.aggregateBalanceObserver = new AggregateBalanceObserver(this.balanceObserver!, this.priceObserver, this.tokensValueConverter);
  }

  private fetchFutureWalletFactory() {
    ensureNotNull(this.relayerConfig, Error, 'Relayer configuration not yet loaded');
    const futureWalletConfig = {
      supportedTokens: this.relayerConfig!.supportedTokens,
      factoryAddress: this.relayerConfig!.factoryAddress,
      contractWhiteList: this.relayerConfig!.contractWhiteList,
      chainSpec: this.relayerConfig!.chainSpec,
    };
    this.futureWalletFactory = this.futureWalletFactory || new FutureWalletFactory(
      futureWalletConfig,
      this.provider,
      this.blockchainService,
      this.relayerApi,
      this,
    );
  }

  async execute(message: Partial<Message>, privateKey: string): Promise<Execution> {
    ensureNotNull(this.relayerConfig, Error, 'Relayer configuration not yet loaded');
    const nonce = message.nonce || parseInt(await this.getNonce(message.from!), 10);
    const partialMessage = {gasToken: ETHER_NATIVE_TOKEN.address, ...message, nonce};
    ensure(partialMessage.gasLimit! <= this.relayerConfig!.maxGasLimit, InvalidGasLimit, `${partialMessage.gasLimit} provided, when relayer's max gas limit is ${this.relayerConfig!.maxGasLimit}`);
    const signedMessage: SignedMessage = messageToSignedMessage(partialMessage, privateKey);
    ensureSufficientGas(signedMessage);
    return this.executionFactory.createExecution(signedMessage);
  }

  protected selfExecute(to: string, method: string, args: any[], privateKey: string, executionOptions: SdkExecutionOptions): Promise<Execution> {
    deprecateSDKMethod('selfExecute');
    return this.createDeployedWallet(to, privateKey).selfExecute(method, args, executionOptions);
  }

  keyExist(walletContractAddress: string, key: string): Promise<boolean> {
    deprecateSDKMethod('keyExist');
    return this.createDeployedWallet(walletContractAddress).keyExist(key);
  }

  async getNonce(walletContractAddress: string) {
    deprecateSDKMethod('getNonce');
    return this.createDeployedWallet(walletContractAddress).getNonce();
  }

  async getWalletContractAddress(ensName: string): Promise<string> {
    const walletContractAddress = await this.resolveName(ensName);
    ensureNotNull(walletContractAddress, InvalidENSRecord, ensName);
    ensureNotNull(await this.blockchainService.getCode(walletContractAddress), InvalidENSRecord, ensName);
    return walletContractAddress;
  }

  async walletContractExist(ensName: string) {
    const walletContractAddress = await this.resolveName(ensName);
    return !!(walletContractAddress && await this.blockchainService.getCode(walletContractAddress));
  }

  async resolveName(ensName: string) {
    const {chainSpec} = this.getRelayerConfig();
    return resolveName(this.provider, chainSpec.ensAddress, ensName);
  }

  async connect(walletContractAddress: string) {
    const {publicKey, privateKey} = createKeyPair();
    await this.relayerApi.connect(walletContractAddress, publicKey, this.sdkConfig.applicationInfo);
    return {
      privateKey,
      securityCode: generateCode(publicKey),
    };
  }

  async denyRequests(contractAddress: string, privateKey: string) {
    const authorisationRequest = {contractAddress};
    signRelayerRequest(authorisationRequest, privateKey);
    await this.relayerApi.denyConnection(authorisationRequest);
  }

  async cancelRequest(contractAddress: string, privateKey: string) {
    const authorisationRequest = {contractAddress};
    signRelayerRequest(authorisationRequest, privateKey);
    return this.relayerApi.cancelConnection(authorisationRequest);
  }

  subscribe(eventType: string, filter: any, callback: Function) {
    ensure(['KeyAdded', 'KeyRemoved'].includes(eventType), InvalidEvent, eventType);
    return this.blockchainObserver.subscribe(eventType, filter, callback);
  }

  async subscribeToBalances(contractAddress: string, callback: OnBalanceChange) {
    await this.fetchBalanceObserver(contractAddress);
    return this.balanceObserver!.subscribe(callback);
  }

  async subscribeToAggregatedBalance(contractAddress: string, callback: OnAggregatedBalanceChange) {
    await this.fetchAggregateBalanceObserver(contractAddress);
    return this.aggregateBalanceObserver!.subscribe(callback);
  }

  subscribeToPrices(callback: OnTokenPricesChange) {
    return this.priceObserver.subscribe(callback);
  }

  subscribeAuthorisations(contractAddress: string, privateKey: string, callback: Function) {
    return this.authorisationsObserver.subscribe(
      signRelayerRequest({contractAddress}, privateKey),
      (notifications: Notification[]) => callback(addCodesToNotifications(notifications)),
    );
  }

  async getConnectedDevices(contractAddress: string, privateKey: string) {
    return this.relayerApi.getConnectedDevices(
      signRelayerRequest({contractAddress}, privateKey),
    );
  }

  async getGasModes() {
    return this.gasModeService.getModes();
  }

  async start() {
    await Promise.all([
      this.fetchRelayerConfig(),
      this.startBlockchainServices(),
    ]);
  }

  private async startBlockchainServices() {
    await this.blockchainObserver.start();
    await this.tokensDetailsStore.fetchTokensDetails();
  }

  stop() {
    this.blockchainObserver.stop();
  }

  async finalizeAndStop() {
    await this.blockchainObserver.finalizeAndStop();
  }
}

export default UniversalLoginSDK;
