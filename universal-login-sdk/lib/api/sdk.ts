import {utils, Contract, providers} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {TokensValueConverter, TokenDetailsService, Notification, generateCode, addCodesToNotifications, resolveName, Message, createSignedMessage, ensureNotNull, PublicRelayerConfig, createKeyPair, signRelayerRequest, ensure, BalanceChecker, deepMerge, DeepPartial, SignedMessage} from '@universal-login/commons';
import AuthorisationsObserver from '../core/observers/AuthorisationsObserver';
import BlockchainObserver from '../core/observers/BlockchainObserver';
import {RelayerApi} from '../integration/http/RelayerApi';
import {BlockchainService} from '../integration/ethereum/BlockchainService';
import {MissingConfiguration, InvalidEvent, InvalidContract, InvalidGasLimit} from '../core/utils/errors';
import {FutureWalletFactory} from './FutureWalletFactory';
import {ExecutionFactory, Execution} from '../core/services/ExecutionFactory';
import {BalanceObserver, OnBalanceChange} from '../core/observers/BalanceObserver';
import {SdkConfigDefault} from '../config/SdkConfigDefault';
import {SdkConfig} from '../config/SdkConfig';
import {AggregateBalanceObserver, OnAggregatedBalanceChange} from '../core/observers/AggregateBalanceObserver';
import {PriceObserver, OnTokenPricesChange} from '../core/observers/PriceObserver';
import {TokensDetailsStore} from '../integration/ethereum/TokensDetailsStore';
import {messageToUnsignedMessage} from '@universal-login/contracts';
import {ensureSufficientGas} from '../core/utils/validation';
import {GasPriceOracle} from '../integration/ethereum/gasPriceOracle';
import {GasModeService} from '../core/services/GasModeService';

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

  constructor(
    relayerUrl: string,
    providerOrUrl: string | providers.Provider,
    sdkConfig?: DeepPartial<SdkConfig>
  ) {
    this.provider = typeof(providerOrUrl) === 'string' ?
      new providers.JsonRpcProvider(providerOrUrl, {chainId: 0} as any)
      : providerOrUrl;
    this.relayerApi = new RelayerApi(relayerUrl);
    this.sdkConfig = deepMerge(SdkConfigDefault, sdkConfig);
    this.authorisationsObserver = new AuthorisationsObserver(this.relayerApi, this.sdkConfig.authorisationsObserverTick);
    this.executionFactory = new ExecutionFactory(this.relayerApi, this.sdkConfig.executionFactoryTick);
    this.blockchainService = new BlockchainService(this.provider);
    this.blockchainObserver = new BlockchainObserver(this.blockchainService);
    this.balanceChecker = new BalanceChecker(this.provider);
    this.tokenDetailsService = new TokenDetailsService(this.provider);
    this.tokensDetailsStore = new TokensDetailsStore(this.tokenDetailsService, this.sdkConfig.observedTokensAddresses);
    this.priceObserver = new PriceObserver(this.tokensDetailsStore, this.sdkConfig.observedCurrencies);
    this.gasPriceOracle = new GasPriceOracle(this.provider);
    this.gasModeService = new GasModeService(this.tokensDetailsStore, this.gasPriceOracle, this.priceObserver);
    this.tokensValueConverter = new TokensValueConverter(this.sdkConfig.observedCurrencies);
  }

  async createFutureWallet() {
    await this.getRelayerConfig();
    this.fetchFutureWalletFactory();
    return this.futureWalletFactory!.createFutureWallet();
  }

  async addKey(to: string, publicKey: string, privateKey: string, transactionDetails: Partial<Message>): Promise<Execution> {
    return this.selfExecute(to, 'addKey', [publicKey], privateKey, transactionDetails);
  }

  async addKeys(to: string, publicKeys: string[], privateKey: string, transactionDetails: Partial<Message>): Promise<Execution> {
    return this.selfExecute(to, 'addKeys', [publicKeys], privateKey, transactionDetails);
  }

  async removeKey(to: string, key: string, privateKey: string, transactionDetails: Partial<Message>): Promise<Execution> {
    return this.selfExecute(to, 'removeKey', [key], privateKey, transactionDetails);
  }

  async setRequiredSignatures(to: string, requiredSignatures: number, privateKey: string, transactionDetails: Partial<Message>): Promise<Execution> {
    return this.selfExecute(to, 'setRequiredSignatures', [requiredSignatures], privateKey, transactionDetails);
  }

  async getMessageStatus(messageHash: string) {
    return this.relayerApi.getStatus(messageHash);
  }

  async getRelayerConfig() {
    this.relayerConfig = this.relayerConfig || (await this.relayerApi.getConfig()).config;
    return this.relayerConfig;
  }

  async fetchBalanceObserver(ensName: string) {
    if (this.balanceObserver) {
      return;
    }
    const walletContractAddress = await this.getWalletContractAddress(ensName);
    ensureNotNull(walletContractAddress, InvalidContract);
    ensureNotNull(this.relayerConfig, MissingConfiguration);

    await this.tokensDetailsStore.fetchTokensDetails();
    this.balanceObserver = new BalanceObserver(this.balanceChecker, walletContractAddress, this.tokensDetailsStore);
  }

  async fetchAggregateBalanceObserver(ensName: string) {
    if (this.aggregateBalanceObserver) {
      return;
    }
    await this.fetchBalanceObserver(ensName);
    this.aggregateBalanceObserver = new AggregateBalanceObserver(this.balanceObserver!, this.priceObserver, this.tokensValueConverter);
  }

  private fetchFutureWalletFactory() {
    ensureNotNull(this.relayerConfig, Error, 'Relayer configuration not yet loaded');
    const futureWalletConfig = {
      supportedTokens: this.relayerConfig!.supportedTokens,
      factoryAddress: this.relayerConfig!.factoryAddress,
      contractWhiteList: this.relayerConfig!.contractWhiteList,
      chainSpec: this.relayerConfig!.chainSpec
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
    const {gasLimit, gasPrice, gasToken} = this.sdkConfig.paymentOptions;
    ensureNotNull(this.relayerConfig, Error, 'Relayer configuration not yet loaded');
    ensure(gasLimit <= this.relayerConfig!.maxGasLimit, InvalidGasLimit, `${gasLimit} provided, when relayer's max gas limit is ${this.relayerConfig!.maxGasLimit}`);

    const unsignedMessage = messageToUnsignedMessage({gasLimit, gasPrice, gasToken, ...message});
    unsignedMessage.nonce = unsignedMessage.nonce || parseInt(await this.getNonce(message.from!), 10);
    ensureSufficientGas(unsignedMessage);

    const signedMessage: SignedMessage = createSignedMessage(unsignedMessage, privateKey);
    return this.executionFactory.createExecution(signedMessage);
  }

  protected selfExecute(to: string, method: string , args: any[], privateKey: string, transactionDetails: Partial<Message>): Promise<Execution> {
    const data = new utils.Interface(WalletContract.interface).functions[method].encode(args);
    const message: Partial<Message> = {
      ...transactionDetails,
      to,
      from: to,
      data
    };
    return this.execute(message, privateKey);
  }

  async keyExist(walletContractAddress: string, key: string) {
    const walletContract = new Contract(walletContractAddress, WalletContract.interface, this.provider);
    return walletContract.keyExist(key);
  }

  async getNonce(walletContractAddress: string) {
    const contract = new Contract(walletContractAddress, WalletContract.interface, this.provider);
    return contract.lastNonce();
  }

  async getWalletContractAddress(ensName: string) {
    const walletContractAddress = await this.resolveName(ensName);
    if (walletContractAddress && await this.blockchainService.getCode(walletContractAddress)) {
      return walletContractAddress;
    }
    return null;
  }

  async walletContractExist(ensName: string) {
    const walletContractAddress = await this.getWalletContractAddress(ensName);
    return walletContractAddress !== null;
  }

  async resolveName(ensName: string) {
    await this.getRelayerConfig();
    const {ensAddress} = this.relayerConfig!.chainSpec;
    return resolveName(this.provider, ensAddress, ensName);
  }

  async connect(walletContractAddress: string) {
    const {publicKey, privateKey} = createKeyPair();
    await this.relayerApi.connect(walletContractAddress, publicKey);
    return {
      privateKey,
      securityCode: generateCode(publicKey)
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

  async subscribeToBalances(ensName: string, callback: OnBalanceChange) {
    await this.fetchBalanceObserver(ensName);
    return this.balanceObserver!.subscribe(callback);
  }

  async subscribeToAggregatedBalance(ensName: string, callback: OnAggregatedBalanceChange) {
    await this.fetchAggregateBalanceObserver(ensName);
    return this.aggregateBalanceObserver!.subscribe(callback);
  }

  subscribeToPrices(callback: OnTokenPricesChange) {
    return this.priceObserver.subscribe(callback);
  }

  subscribeAuthorisations(contractAddress: string, privateKey: string, callback: Function) {
    return this.authorisationsObserver.subscribe(
      signRelayerRequest({contractAddress}, privateKey),
      (notifications: Notification[]) => callback(addCodesToNotifications(notifications))
    );
  }

  async getConnectedDevices(contractAddress: string, privateKey: string) {
    return this.relayerApi.getConnectedDevices(
      signRelayerRequest({contractAddress}, privateKey)
    );
  }

  async getGasModes() {
    return this.gasModeService.getModes();
  }

  async start() {
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
