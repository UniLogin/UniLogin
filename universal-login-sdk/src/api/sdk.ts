import {addCodesToNotifications, BalanceChecker, createKeyPair, deepMerge, DeepPartial, ensure, ensureNotFalsy, generateCode, Notification, PublicRelayerConfig, resolveName, TokenDetailsService, TokensValueConverter, SufficientBalanceValidator, Nullable, GasMode, MessageStatus, Network, asNetwork, Lazy, GasPriceOracle, TokenPricesService, ProviderService, Erc721TokensService, CoingeckoRelayerApi, Coingecko} from '@unilogin/commons';
import {ContractService} from '@unilogin/contracts';
import {providers} from 'ethers';
import {SdkConfig} from '../config/SdkConfig';
import {SdkConfigDefault} from '../config/SdkConfigDefault';
import {AggregateBalanceObserver, OnAggregatedBalanceChange} from '../core/observers/AggregateBalanceObserver';
import AuthorisationsObserver from '../core/observers/AuthorisationsObserver';
import {BalanceObserver, OnBalanceChange} from '../core/observers/BalanceObserver';
import {OnTokenPricesChange, PriceObserver} from '../core/observers/PriceObserver';
import {ExecutionFactory} from '../core/services/ExecutionFactory';
import {FeatureFlagsService} from '../core/services/FeatureFlagsService';
import {GasModeService} from '../core/services/GasModeService';
import {MessageConverter} from '../core/services/MessageConverter';
import {TokensDetailsStore} from '../core/services/TokensDetailsStore';
import {InvalidContract, InvalidENSRecord, InvalidEvent} from '../core/utils/errors';
import {ENSService} from '../integration/ethereum/ENSService';
import {RelayerApi} from '../integration/http/RelayerApi';
import {FutureWalletFactory} from './FutureWalletFactory';
import {FutureWallet} from './wallet/FutureWallet';
import {WalletEventType, WalletEventFilter, WalletEventCallback} from '../core/models/events';
import WalletEventsObserverFactory from '../core/observers/WalletEventsObserverFactory';
import {BlockNumberState} from '../core/states/BlockNumberState';
import {WalletContractService} from '../integration/ethereum/WalletContractService';
import {Beta2Service} from '../integration/ethereum/Beta2Service';
import {GnosisSafeService} from '../integration/ethereum/GnosisSafeService';
import {NotifySdk} from '../integration/notifySdk/NotifySdk';
import {cast} from '@restless/sanitizers';
import {INotifySdk} from '../integration/notifySdk/interfaces';
import {OnErc721TokensChange, Erc721TokensObserver} from '../core/observers/Erc721TokensObserver';

class UniLoginSdk {
  readonly provider: providers.JsonRpcProvider;
  readonly relayerApi: RelayerApi;
  readonly authorisationsObserver: AuthorisationsObserver;
  readonly blockNumberState: BlockNumberState;
  readonly executionFactory: ExecutionFactory;
  readonly balanceChecker: BalanceChecker;
  readonly tokensValueConverter: TokensValueConverter;
  readonly priceObserver: PriceObserver;
  readonly tokenDetailsService: TokenDetailsService;
  readonly tokensDetailsStore: TokensDetailsStore;
  readonly tokenPricesService: TokenPricesService;
  readonly providerService: ProviderService;
  readonly contractService: ContractService;
  readonly erc721TokensService: Erc721TokensService;
  readonly gasPriceOracle: GasPriceOracle;
  readonly gasModeService: GasModeService;
  readonly config: SdkConfig;
  readonly sufficientBalanceValidator: SufficientBalanceValidator;
  readonly factoryAddress?: string;
  readonly featureFlagsService: FeatureFlagsService;
  readonly messageConverter: MessageConverter;
  readonly walletEventsObserverFactory: WalletEventsObserverFactory;
  readonly walletContractService: WalletContractService;
  private readonly relayerConfig: Lazy<PublicRelayerConfig>;
  balanceObserver?: BalanceObserver;
  erc721TokensObserver?: Erc721TokensObserver;
  aggregateBalanceObserver?: AggregateBalanceObserver;
  futureWalletFactory?: FutureWalletFactory;
  notifySdk?: INotifySdk;

  constructor(
    relayerUrl: string,
    providerOrUrl: string | providers.JsonRpcProvider,
    config?: DeepPartial<SdkConfig>,
  ) {
    this.provider = typeof (providerOrUrl) === 'string'
      ? new providers.JsonRpcProvider(providerOrUrl)
      : providerOrUrl;
    this.config = deepMerge(SdkConfigDefault, config);
    this.relayerApi = new RelayerApi(relayerUrl, this.config.apiKey);
    this.authorisationsObserver = new AuthorisationsObserver(this.relayerApi, this.config.authorizationsObserverTick);
    this.executionFactory = new ExecutionFactory(this.relayerApi, this.config.mineableFactoryTick, this.config.mineableFactoryTimeout);
    this.providerService = new ProviderService(this.provider);
    this.contractService = new ContractService(this.providerService);
    this.blockNumberState = new BlockNumberState(this.providerService);
    this.walletEventsObserverFactory = new WalletEventsObserverFactory(this.providerService, this.blockNumberState, this.config.storageService);
    this.balanceChecker = new BalanceChecker(this.providerService);
    this.sufficientBalanceValidator = new SufficientBalanceValidator(this.providerService);
    this.tokenDetailsService = new TokenDetailsService(this.provider, this.config.saiTokenAddress);
    this.tokensDetailsStore = new TokensDetailsStore(this.tokenDetailsService, this.config.observedTokensAddresses);
    this.tokenPricesService = new TokenPricesService(new Coingecko(new CoingeckoRelayerApi(relayerUrl)));
    this.erc721TokensService = new Erc721TokensService(this.config.network);
    this.priceObserver = new PriceObserver(this.tokensDetailsStore, this.tokenPricesService, this.config.priceObserverTick);
    this.gasPriceOracle = new GasPriceOracle();
    this.tokensValueConverter = new TokensValueConverter(this.config.observedCurrencies);
    this.gasModeService = new GasModeService(this.tokensDetailsStore, this.gasPriceOracle, this.priceObserver);
    this.featureFlagsService = new FeatureFlagsService();
    this.messageConverter = new MessageConverter(this.contractService, this.providerService);
    const beta2Service = new Beta2Service(this.provider);
    const gnosisSafeService = new GnosisSafeService(this.provider);
    this.walletContractService = new WalletContractService(this.contractService, beta2Service, gnosisSafeService);
    this.relayerConfig = new Lazy(() => this.loadRelayerConfigFromApi());
  }

  private async loadRelayerConfigFromApi() {
    const config = await this.relayerApi.getConfig();
    if (!Network.equals(cast(config.network, asNetwork), this.config.network)) {
      throw new Error(`Relayer is configured to a different network. Expected: ${this.config.network}, got: ${config.network}`);
    }
    return config;
  }

  getNotice() {
    return `running on ${this.config.network}`;
  }

  isRefundPaid() {
    return !!this.config.apiKey;
  }

  getFutureWalletFactory() {
    this.getRelayerConfig();
    this.fetchFutureWalletFactory();
    return this.futureWalletFactory!;
  }

  createFutureWallet(ensName: string, gasPrice: string, gasToken: string, email?: string): Promise<FutureWallet> {
    return this.getFutureWalletFactory().createNew(ensName, gasPrice, gasToken, email);
  }

  getMessageStatus(messageHash: string): Promise<MessageStatus> {
    return this.relayerApi.getStatus(messageHash);
  }

  getRelayerConfig(): PublicRelayerConfig {
    return this.relayerConfig.get();
  }

  fetchRelayerConfig(): Promise<PublicRelayerConfig> {
    return this.relayerConfig.load();
  }

  async fetchBalanceObserver(contractAddress: string) {
    if (this.balanceObserver) {
      return;
    }
    ensureNotFalsy(contractAddress, InvalidContract);

    await this.tokensDetailsStore.fetchTokensDetails();
    this.balanceObserver = new BalanceObserver(this.balanceChecker, contractAddress, this.tokensDetailsStore, this.blockNumberState, this.providerService);
  }

  async fetchErc721TokensObserver(contractAddress: string) {
    if (this.erc721TokensObserver) {
      return;
    }
    ensureNotFalsy(contractAddress, InvalidContract);

    this.erc721TokensObserver = new Erc721TokensObserver(contractAddress, this.erc721TokensService, this.config.erc721TokensObserverTick);
  }

  async fetchAggregateBalanceObserver(contractAddress: string) {
    if (this.aggregateBalanceObserver) {
      return;
    }
    await this.fetchBalanceObserver(contractAddress);
    this.aggregateBalanceObserver = new AggregateBalanceObserver(this.balanceObserver!, this.priceObserver, this.tokensValueConverter);
  }

  private fetchFutureWalletFactory() {
    const {supportedTokens, factoryAddress, contractWhiteList, ensAddress, ensRegistrar, walletContractAddress, relayerAddress, fallbackHandlerAddress} = this.getRelayerConfig();
    const futureWalletConfig = {supportedTokens, factoryAddress, contractWhiteList, ensAddress, walletContractAddress, relayerAddress, fallbackHandlerAddress};
    this.futureWalletFactory = this.futureWalletFactory || new FutureWalletFactory(
      futureWalletConfig,
      new ENSService(this.provider, futureWalletConfig.ensAddress, ensRegistrar),
      this,
      this.balanceChecker,
    );
  }

  async getWalletContractAddress(ensName: string): Promise<string> {
    const walletContractAddress = await this.resolveName(ensName);
    ensureNotFalsy(walletContractAddress, InvalidENSRecord, ensName);
    ensure(await this.providerService.getCode(walletContractAddress) !== '0x', InvalidENSRecord, ensName);
    return walletContractAddress;
  }

  async walletContractExist(ensName: string) {
    const walletContractAddress = await this.resolveName(ensName);
    return !!(walletContractAddress && await this.providerService.getCode(walletContractAddress));
  }

  async resolveName(ensName: string): Promise<Nullable<string>> {
    const {ensAddress} = await this.fetchRelayerConfig();
    return resolveName(this.provider, ensAddress, ensName);
  }

  async connect(walletContractAddress: string) {
    const {publicKey, privateKey} = createKeyPair();
    await this.relayerApi.connect(walletContractAddress, publicKey, this.config.applicationInfo);
    return {
      privateKey,
      securityCode: generateCode(publicKey),
    };
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    ensure(['KeyAdded', 'KeyRemoved', 'AddedOwner', 'RemovedOwner'].includes(eventType), InvalidEvent, eventType);
    return this.walletEventsObserverFactory.subscribe(eventType, filter, callback);
  }

  async subscribeToBalances(contractAddress: string, callback: OnBalanceChange) {
    await this.fetchBalanceObserver(contractAddress);
    return this.balanceObserver!.subscribe(callback);
  }

  async subscribeToErc721Tokens(contractAddress: string, callback: OnErc721TokensChange) {
    await this.fetchErc721TokensObserver(contractAddress);
    return this.erc721TokensObserver!.subscribe(callback);
  }

  async subscribeToAggregatedBalance(contractAddress: string, callback: OnAggregatedBalanceChange) {
    await this.fetchAggregateBalanceObserver(contractAddress);
    return this.aggregateBalanceObserver!.subscribe(callback);
  }

  subscribeToPrices(callback: OnTokenPricesChange) {
    return this.priceObserver.subscribe(callback);
  }

  async subscribeAuthorisations(contractAddress: string, privateKey: string, callback: Function) {
    return this.authorisationsObserver.subscribe(
      await this.walletContractService.signRelayerRequest(privateKey, {contractAddress}),
      (notifications: Notification[]) => callback(addCodesToNotifications(notifications)),
    );
  }

  async getConnectedDevices(contractAddress: string, privateKey: string) {
    return this.relayerApi.getConnectedDevices(
      await this.walletContractService.signRelayerRequest(privateKey, {contractAddress}),
    );
  }

  getGasModes(): Promise<GasMode[]> {
    return this.gasModeService.getModes();
  }

  getNotifySdk(): INotifySdk {
    if (!this.notifySdk) {
      const relayerConfig = this.getRelayerConfig();
      this.notifySdk = NotifySdk.createForNetwork(
        this.config.notifySdkApiKey,
        cast(relayerConfig.network, asNetwork),
      );
    }
    return this.notifySdk!;
  }

  async start() {
    await Promise.all([
      this.fetchRelayerConfig(),
      this.startBlockchainServices(),
    ]);
  }

  private async startBlockchainServices() {
    await this.walletEventsObserverFactory.start();
    await this.tokensDetailsStore.fetchTokensDetails();
  }

  stop() {
    this.walletEventsObserverFactory.stop();
  }

  async finalizeAndStop() {
    // We need to ensure no background relayer calls are being made
    await Promise.all([
      this.priceObserver.finalizeAndStop(),
      this.authorisationsObserver.finalizeAndStop(),
      this.erc721TokensObserver?.finalizeAndStop(),
    ]);
    this.walletEventsObserverFactory.finalizeAndStop();
  }
}

export default UniLoginSdk;
