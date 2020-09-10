import express, {Application} from 'express';
import WalletRouter from '../routes/wallet';
import CoingeckoRouter from '../routes/coingecko';
import ConfigRouter, {getPublicConfig} from '../routes/config';
import RequestAuthorisationRouter from '../routes/authorisation';
import DevicesRouter from '../routes/devices';
import EmailRouter from '../routes/email';
import {WalletDeploymentService} from '../../integration/ethereum/WalletDeploymentService';
import ENSService from '../../integration/ethereum/ensService';
import bodyParser from 'body-parser';
import {Wallet, providers} from 'ethers';
import cors from 'cors';
import useragent from 'express-useragent';
import Knex from 'knex';
import {Server} from 'http';
import {Config} from '../../config/config';
import MessageHandler from '../../core/services/execution/messages/MessageHandler';
import QueueSQLStore from '../../integration/sql/services/QueueSQLStore';
import errorHandler from '../middlewares/errorHandler';
import MessageSQLRepository from '../../integration/sql/services/MessageSQLRepository';
import AuthorisationService from '../../core/services/AuthorisationService';
import {WalletDeployer} from '../../integration/ethereum/WalletDeployer';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import RelayerRequestSignatureValidator from '../../integration/ethereum/validators/RelayerRequestSignatureValidator';
import {MessageStatusService} from '../../core/services/execution/messages/MessageStatusService';
import {Beta2Service} from '../../integration/ethereum/Beta2Service';
import MessageExecutionValidator from '../../integration/ethereum/validators/MessageExecutionValidator';
import MessageExecutor from '../../integration/ethereum/MessageExecutor';
import {BalanceChecker, GasPriceOracle, PublicRelayerConfig, TokenPricesService, TokenDetailsService, ProviderService, CoingeckoApi} from '@unilogin/commons';
import {DevicesStore} from '../../integration/sql/services/DevicesStore';
import {DevicesService} from '../../core/services/DevicesService';
import DeploymentHandler from '../../core/services/execution/deployment/DeploymentHandler';
import ExecutionWorker from '../../core/services/execution/ExecutionWorker';
import DeploymentExecutor from '../../integration/ethereum/DeploymentExecutor';
import {MinedTransactionHandler} from '../../core/services/execution/MinedTransactionHandler';
import {httpsRedirect} from '../middlewares/httpsRedirect';
import {GasComputation} from '../../core/services/GasComputation';
import {ContractService} from '@unilogin/contracts';
import {MessageHandlerValidator} from '../../core/services/validators/MessageHandlerValidator';
import {WalletContractService} from '../../integration/ethereum/WalletContractService';
import {GnosisSafeService} from '../../integration/ethereum/GnosisSafeService';
import {FutureWalletHandler} from '../../core/services/FutureWalletHandler';
import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';
import {RefundPayerStore} from '../../integration/sql/services/RefundPayerStore';
import {RefundPayerValidator} from '../../core/services/validators/RefundPayerValidator';
import {ApiKeyHandler} from '../../core/services/execution/ApiKeyHandler';
import {TransactionGasPriceComputator} from '../../integration/ethereum/TransactionGasPriceComputator';
import SQLRepository from '../../integration/sql/services/SQLRepository';
import Deployment from '../../core/models/Deployment';
import {GasTokenValidator} from '../../core/services/validators/GasTokenValidator';
import {BalanceValidator} from '../../integration/ethereum/BalanceValidator';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {EmailConfirmationHandler} from '../../core/services/EmailConfirmationHandler';
import {EmailService} from '../../integration/ethereum/EmailService';
import {EmailConfirmationValidator} from '../../core/services/validators/EmailConfirmationValidator';
import EstimateGasValidator from '../../integration/ethereum/validators/EstimateGasValidator';
import {EncryptedWalletHandler} from '../../core/services/EncryptedWalletHandler';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {RestoreWalletHandler} from '../../core/services/RestoreWalletHandler';

const defaultPort = '3311';

class Relayer {
  protected readonly port: string;
  provider: providers.JsonRpcProvider;
  protected readonly wallet: Wallet;
  readonly database: Knex;
  private ensService: ENSService = {} as ENSService;
  private executionWorker: ExecutionWorker = {} as ExecutionWorker;
  protected walletContractService: WalletContractService = {} as WalletContractService;
  private app: Application = {} as Application;
  protected server: Server = {} as Server;
  publicConfig: PublicRelayerConfig;
  protected tokenPricesService: TokenPricesService = {} as TokenPricesService;
  protected gasPriceOracle: GasPriceOracle = {} as GasPriceOracle;
  protected futureWalletHandler: FutureWalletHandler = {} as FutureWalletHandler;
  protected emailService: EmailService = {} as EmailService;
  protected emailConfirmationStore: EmailConfirmationsStore = {} as EmailConfirmationsStore;
  protected encryptedWalletsStore: EncryptedWalletsStore = {} as EncryptedWalletsStore;

  constructor(protected config: Config, provider?: providers.JsonRpcProvider) {
    this.port = config.port || defaultPort;
    this.provider = provider || new providers.JsonRpcProvider(config.jsonRpcUrl,
      {
        ensAddress: config.ensAddress,
        name: config.network,
        chainId: 0,
      });
    this.wallet = new Wallet(config.privateKey, this.provider);
    this.database = Knex(config.database);
    this.publicConfig = getPublicConfig(this.config);
  }

  async start() {
    await this.database.migrate.latest();
    this.runServer();
    await this.ensService.start();
    this.executionWorker.start();
  }

  runServer() {
    this.app = express();
    this.app.set('trust proxy', true);

    this.app.use(useragent.express());
    this.app.use(cors({
      origin: '*',
      credentials: true,
    }));
    if (this.config.httpsRedirect) {
      this.app.use(httpsRedirect);
    }

    this.ensService = new ENSService(this.config.ensAddress, this.config.ensRegistrars, this.provider);
    const providerService = new ProviderService(this.provider);
    const contractService = new ContractService(providerService);
    const gasComputation = new GasComputation(contractService, providerService);
    const messageHandlerValidator = new MessageHandlerValidator(this.publicConfig.maxGasLimit, gasComputation, this.wallet.address, this.config.supportedTokens);
    const walletDeployer = new WalletDeployer(this.config.factoryAddress, this.wallet);
    const balanceChecker = new BalanceChecker(providerService);
    const messageRepository = new MessageSQLRepository(this.database);
    const deploymentRepository = new SQLRepository<Deployment>(this.database, 'deployments');
    const executionQueue = new QueueSQLStore(this.database);
    const refundPayerStore = new RefundPayerStore(this.database);
    const refundPayerValidator = new RefundPayerValidator(refundPayerStore);
    const apiKeyHandler = new ApiKeyHandler(refundPayerValidator, refundPayerStore);
    this.gasPriceOracle = new GasPriceOracle();
    const transactionGasPriceComputator = new TransactionGasPriceComputator(this.gasPriceOracle);
    this.walletContractService = new WalletContractService(contractService, new Beta2Service(this.provider, transactionGasPriceComputator), new GnosisSafeService(this.provider, transactionGasPriceComputator));
    const relayerRequestSignatureValidator = new RelayerRequestSignatureValidator(this.walletContractService);
    const authorisationStore = new AuthorisationStore(this.database);
    const authorisationService = new AuthorisationService(authorisationStore, relayerRequestSignatureValidator, this.walletContractService);
    const devicesStore = new DevicesStore(this.database);
    const devicesService = new DevicesService(devicesStore, relayerRequestSignatureValidator);
    const futureWalletStore = new FutureWalletStore(this.database);
    this.emailConfirmationStore = new EmailConfirmationsStore(this.database);
    this.emailService = new EmailService(this.config.email);
    const emailConfirmationValidator = new EmailConfirmationValidator(this.config.codeExpirationTimeInMinutes);
    this.tokenPricesService = new TokenPricesService();
    const gasTokenValidator = new GasTokenValidator(this.gasPriceOracle);
    const tokenDetailsService = new TokenDetailsService(this.provider);
    this.futureWalletHandler = new FutureWalletHandler(futureWalletStore, this.tokenPricesService, tokenDetailsService, gasTokenValidator);
    const deploymentHandler = new DeploymentHandler(deploymentRepository, executionQueue, gasTokenValidator, futureWalletStore);
    const balanceValidator = new BalanceValidator(balanceChecker);
    const walletService = new WalletDeploymentService(this.config, this.ensService, walletDeployer, balanceValidator, devicesService, transactionGasPriceComputator, futureWalletStore);
    const statusService = new MessageStatusService(messageRepository, this.walletContractService);
    const messageHandler = new MessageHandler(messageRepository, executionQueue, statusService, this.walletContractService, this.tokenPricesService, tokenDetailsService, messageHandlerValidator, gasTokenValidator);
    const messageExecutionValidator = new MessageExecutionValidator(providerService, this.config.contractWhiteList, this.walletContractService);
    const minedTransactionHandler = new MinedTransactionHandler(authorisationStore, devicesService, this.walletContractService);
    const estimateGasValidator = new EstimateGasValidator(this.wallet, this.walletContractService);
    const messageExecutor = new MessageExecutor(this.wallet, messageExecutionValidator, messageRepository, minedTransactionHandler, this.walletContractService, gasTokenValidator, estimateGasValidator);
    const deploymentExecutor = new DeploymentExecutor(deploymentRepository, walletService);
    this.executionWorker = new ExecutionWorker([messageExecutor, deploymentExecutor], executionQueue);
    this.encryptedWalletsStore = new EncryptedWalletsStore(this.database);
    const emailConfirmationHandler = new EmailConfirmationHandler(this.emailConfirmationStore, this.emailService, emailConfirmationValidator, this.encryptedWalletsStore);
    const encryptedWalletHandler = new EncryptedWalletHandler(this.emailConfirmationStore, emailConfirmationValidator, this.encryptedWalletsStore);
    const restoreWalletHandler = new RestoreWalletHandler(this.emailConfirmationStore, emailConfirmationValidator, this.encryptedWalletsStore, futureWalletStore);

    this.app.use(bodyParser.json());
    this.app.use('/email', EmailRouter(emailConfirmationHandler));
    this.app.use('/wallet', WalletRouter(deploymentHandler, messageHandler, this.futureWalletHandler, apiKeyHandler, encryptedWalletHandler, restoreWalletHandler));
    this.app.use('/config', ConfigRouter(this.publicConfig));
    this.app.use('/authorisation', RequestAuthorisationRouter(authorisationService));
    this.app.use('/devices', DevicesRouter(devicesService));
    this.app.use('/coingecko', CoingeckoRouter(new CoingeckoApi()));
    this.app.use(errorHandler);
    this.server = this.app.listen(this.port);
  }

  async stop() {
    this.executionWorker.stop();
    await this.database.destroy();
    await new Promise(resolve => this.server.close(resolve));
  }

  async stopLater() {
    await new Promise(resolve => this.server.close(resolve));
    await this.executionWorker.stopLater();
    await this.database.destroy();
  }
}

export default Relayer;
