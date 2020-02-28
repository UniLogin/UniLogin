import express, {Application} from 'express';
import WalletRouter from '../routes/wallet';
import ConfigRouter, {getPublicConfig} from '../routes/config';
import RequestAuthorisationRouter from '../routes/authorisation';
import DevicesRouter from '../routes/devices';
import {WalletDeploymentService} from '../../integration/ethereum/WalletDeploymentService';
import ENSService from '../../integration/ethereum/ensService';
import bodyParser from 'body-parser';
import {Wallet, providers} from 'ethers';
import cors from 'cors';
import useragent from 'express-useragent';
import Knex from 'knex';
import {Server} from 'http';
import {Config} from '../../config/relayer';
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
import {BalanceChecker, RequiredBalanceChecker, PublicRelayerConfig} from '@unilogin/commons';
import {DevicesStore} from '../../integration/sql/services/DevicesStore';
import {DevicesService} from '../../core/services/DevicesService';
import DeploymentHandler from '../../core/services/execution/deployment/DeploymentHandler';
import SQLRepository from '../../integration/sql/services/SQLRepository';
import ExecutionWorker from '../../core/services/execution/ExecutionWorker';
import DeploymentExecutor from '../../integration/ethereum/DeploymentExecutor';
import {MinedTransactionHandler} from '../../core/services/execution/MinedTransactionHandler';
import {httpsRedirect} from '../middlewares/httpsRedirect';
import {GasComputation} from '../../core/services/GasComputation';
import {BlockchainService} from '@unilogin/contracts';
import {MessageHandlerValidator} from '../../core/services/validators/MessageHandlerValidator';
import PendingMessages from '../../core/services/execution/messages/PendingMessages';
import {WalletContractService} from '../../integration/ethereum/WalletContractService';
import {GnosisSafeService} from '../../integration/ethereum/GnosisSafeService';

const defaultPort = '3311';

export type RelayerClass = {
  new(config: any, provider: providers.Provider): Relayer;
};

class Relayer {
  protected readonly port: string;
  provider: providers.Provider;
  protected readonly wallet: Wallet;
  readonly database: Knex;
  private ensService: ENSService = {} as ENSService;
  private executionWorker: ExecutionWorker = {} as ExecutionWorker;
  protected walletContractService: WalletContractService = {} as WalletContractService;
  private app: Application = {} as Application;
  protected server: Server = {} as Server;
  publicConfig: PublicRelayerConfig;

  constructor(protected config: Config, provider?: providers.Provider) {
    this.port = config.port || defaultPort;
    this.provider = provider || new providers.JsonRpcProvider(config.jsonRpcUrl, config.chainSpec);
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

    this.ensService = new ENSService(this.config.chainSpec.ensAddress, this.config.ensRegistrars, this.provider);
    const blockchainService = new BlockchainService(this.provider);
    const gasComputation = new GasComputation(blockchainService);
    const messageHandlerValidator = new MessageHandlerValidator(this.publicConfig.maxGasLimit, gasComputation, this.wallet.address);
    const walletDeployer = new WalletDeployer(this.config.factoryAddress, this.wallet);
    const balanceChecker = new BalanceChecker(this.provider);
    const requiredBalanceChecker = new RequiredBalanceChecker(balanceChecker);
    const messageRepository = new MessageSQLRepository(this.database);
    const deploymentRepository = new SQLRepository(this.database, 'deployments');
    const executionQueue = new QueueSQLStore(this.database);
    const deploymentHandler = new DeploymentHandler(deploymentRepository, executionQueue);
    this.walletContractService = new WalletContractService(blockchainService, new Beta2Service(this.provider), new GnosisSafeService(this.provider));
    const relayerRequestSignatureValidator = new RelayerRequestSignatureValidator(this.walletContractService);
    const authorisationStore = new AuthorisationStore(this.database);
    const authorisationService = new AuthorisationService(authorisationStore, relayerRequestSignatureValidator, this.walletContractService);
    const devicesStore = new DevicesStore(this.database);
    const devicesService = new DevicesService(devicesStore, relayerRequestSignatureValidator);
    const walletService = new WalletDeploymentService(this.config, this.ensService, walletDeployer, requiredBalanceChecker, devicesService);
    const statusService = new MessageStatusService(messageRepository, this.walletContractService);
    const pendingMessages = new PendingMessages(messageRepository, executionQueue, statusService, this.walletContractService);
    const messageHandler = new MessageHandler(pendingMessages, messageHandlerValidator);
    const messageExecutionValidator = new MessageExecutionValidator(this.wallet, this.config.contractWhiteList, this.walletContractService);
    const minedTransactionHandler = new MinedTransactionHandler(authorisationStore, devicesService, this.walletContractService);
    const messageExecutor = new MessageExecutor(this.wallet, messageExecutionValidator, messageRepository, minedTransactionHandler, this.walletContractService);
    const deploymentExecutor = new DeploymentExecutor(deploymentRepository, walletService);
    this.executionWorker = new ExecutionWorker([messageExecutor, deploymentExecutor], executionQueue);

    this.app.use(bodyParser.json());
    this.app.use('/wallet', WalletRouter(deploymentHandler, messageHandler));
    this.app.use('/config', ConfigRouter(this.publicConfig));
    this.app.use('/authorisation', RequestAuthorisationRouter(authorisationService));
    this.app.use('/devices', DevicesRouter(devicesService));
    this.app.use(errorHandler);
    this.server = this.app.listen(this.port);
  }

  async stop() {
    await this.executionWorker.stop();
    await this.database.destroy();
    await new Promise(resolve => this.server.close(resolve));
  }

  async stopLater() {
    await this.executionWorker.stopLater();
    await this.database.destroy();
    await new Promise(resolve => this.server.close(resolve));
  }
}

export default Relayer;
