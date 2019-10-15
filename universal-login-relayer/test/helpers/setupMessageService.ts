import Knex from 'knex';
import {EventEmitter} from 'fbemitter';
import {loadFixture} from 'ethereum-waffle';
import MessageHandler from '../../lib/core/services/MessageHandler';
import QueueSQLStore from '../../lib/integration/sql/services/QueueSQLStore';
import AuthorisationStore from '../../lib/integration/sql/services/AuthorisationStore';
import basicWalletContractWithMockToken from '../fixtures/basicWalletContractWithMockToken';
import MessageSQLRepository from '../../lib/integration/sql/services/MessageSQLRepository';
import {getContractWhiteList} from '../../lib/http/relayers/RelayerUnderTest';
import {MessageStatusService} from '../../lib/core/services/messages/MessageStatusService';
import {SignaturesService} from '../../lib/integration/ethereum/SignaturesService';
import IMessageValidator from '../../lib/core/models/IMessageValidator';
import MessageExecutionValidator from '../../lib/integration/ethereum/validators/MessageExecutionValidator';
import MessageExecutor from '../../lib/integration/ethereum/MessageExecutor';
import {DevicesStore} from '../../lib/integration/sql/services/DevicesStore';
import {DevicesService} from '../../lib/core/services/DevicesService';
import WalletMasterContractService from '../../lib/integration/ethereum/services/WalletMasterContractService';
import {GasValidator} from '../../lib/core/services/validators/GasValidator';
import {Config} from '../../lib';
import ExecutionWorker from '../../lib/core/services/messages/ExecutionWorker';
import DeploymentExecutor from '../../lib/integration/ethereum/DeploymentExecutor';
import SQLRepository from '../../lib/integration/sql/services/SQLRepository';
import Deployment from '../../lib/core/models/Deployment';
import {MinedTransactionHandler} from '../../lib/core/services/execution/MinedTransactionHandler';
import setupWalletService from './setupWalletService';

export default async function setupMessageService(knex: Knex, config: Config) {
  const {wallet, actionKey, provider, mockToken, walletContract, otherWallet} = await loadFixture(basicWalletContractWithMockToken);
  const hooks = new EventEmitter();
  const authorisationStore = new AuthorisationStore(knex);
  const messageRepository = new MessageSQLRepository(knex);
  const deploymentRepository = new SQLRepository<Deployment>(knex, 'deployments');
  const devicesStore = new DevicesStore(knex);
  const executionQueue = new QueueSQLStore(knex);
  const walletMasterContractService = new WalletMasterContractService(provider);
  const devicesService = new DevicesService(devicesStore, walletMasterContractService);
  const signaturesService = new SignaturesService(wallet);
  const statusService = new MessageStatusService(messageRepository, signaturesService);
  const messageExecutionValidator: IMessageValidator = new MessageExecutionValidator(wallet, getContractWhiteList());
  const gasValidator = new GasValidator(config.maxGasLimit);
  const minedTransactionHandler = new MinedTransactionHandler(hooks, authorisationStore, devicesService);
  const messageHandler = new MessageHandler(wallet, messageRepository, statusService, gasValidator, executionQueue);
  const messageExecutor = new MessageExecutor(wallet, messageExecutionValidator, messageRepository, minedTransactionHandler);
  const {walletService} = await setupWalletService(wallet);
  const deploymentExecutor = new DeploymentExecutor(deploymentRepository, walletService);
  const executionWorker = new ExecutionWorker([messageExecutor, deploymentExecutor], executionQueue);
  return {wallet, actionKey, provider, mockToken, authorisationStore, devicesStore, messageHandler, walletContract, otherWallet, executionWorker};
}
