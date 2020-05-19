import Knex from 'knex';
import {loadFixture} from 'ethereum-waffle';
import {IMessageValidator, MAX_GAS_LIMIT, TokenDetailsService, ETHER_NATIVE_TOKEN, deployContract} from '@unilogin/commons';
import MessageHandler from '../../src/core/services/execution/messages/MessageHandler';
import QueueSQLStore from '../../src/integration/sql/services/QueueSQLStore';
import AuthorisationStore from '../../src/integration/sql/services/AuthorisationStore';
import {basicWalletContractWithMockToken} from '../fixtures/basicWalletContractWithMockToken';
import MessageSQLRepository from '../../src/integration/sql/services/MessageSQLRepository';
import {getContractWhiteList} from '../../src/http/relayers/RelayerUnderTest';
import {MessageStatusService} from '../../src/core/services/execution/messages/MessageStatusService';
import MessageExecutionValidator from '../../src/integration/ethereum/validators/MessageExecutionValidator';
import MessageExecutor from '../../src/integration/ethereum/MessageExecutor';
import {DevicesStore} from '../../src/integration/sql/services/DevicesStore';
import {DevicesService} from '../../src/core/services/DevicesService';
import RelayerRequestSignatureValidator from '../../src/integration/ethereum/validators/RelayerRequestSignatureValidator';
import ExecutionWorker from '../../src/core/services/execution/ExecutionWorker';
import DeploymentExecutor from '../../src/integration/ethereum/DeploymentExecutor';
import SQLRepository from '../../src/integration/sql/services/SQLRepository';
import Deployment from '../../src/core/models/Deployment';
import {MinedTransactionHandler} from '../../src/core/services/execution/MinedTransactionHandler';
import setupWalletService from './setupWalletService';
import {GasComputation} from '../../src/core/services/GasComputation';
import {BlockchainService} from '@unilogin/contracts';
import MessageHandlerValidator from '../../src/core/services/validators/MessageHandlerValidator';
import {setupWalletContractService} from './setupWalletContractService';
import {GasTokenValidator} from '../../src/core/services/validators/GasTokenValidator';
import {getTokenPricesServiceMock, gasPriceOracleMock} from '@unilogin/commons/testutils';
import {mockContracts} from '@unilogin/contracts/testutils';

export default async function setupMessageService(knex: Knex) {
  const {wallet, actionKey, provider, mockToken, walletContract, otherWallet} = await loadFixture(basicWalletContractWithMockToken);
  const authorisationStore = new AuthorisationStore(knex);
  const messageRepository = new MessageSQLRepository(knex);
  const deploymentRepository = new SQLRepository<Deployment>(knex, 'deployments');
  const devicesStore = new DevicesStore(knex);
  const executionQueue = new QueueSQLStore(knex);
  const blockchainService = new BlockchainService(provider);
  const gasComputation = new GasComputation(blockchainService);
  const mockTokenNotOwned = await deployContract(wallet, mockContracts.MockToken as any);
  const messageHandlerValidator = new MessageHandlerValidator(MAX_GAS_LIMIT, gasComputation, wallet.address, [{address: ETHER_NATIVE_TOKEN.address}, {address: mockToken.address}, {address: mockTokenNotOwned.address}]);
  const walletContractService = setupWalletContractService(provider);
  const relayerRequestSignatureValidator = new RelayerRequestSignatureValidator(walletContractService);
  const devicesService = new DevicesService(devicesStore, relayerRequestSignatureValidator);
  const minedTransactionHandler = new MinedTransactionHandler(authorisationStore, devicesService, walletContractService);
  const messageExecutionValidator: IMessageValidator = new MessageExecutionValidator(wallet, getContractWhiteList(), walletContractService);
  const statusService = new MessageStatusService(messageRepository, walletContractService);
  const tokenDetailsService = new TokenDetailsService(provider);
  const gasTokenValidator = new GasTokenValidator(gasPriceOracleMock);
  const messageHandler = new MessageHandler(messageRepository, executionQueue, statusService, walletContractService, getTokenPricesServiceMock(), tokenDetailsService, messageHandlerValidator, gasTokenValidator);
  const messageExecutor = new MessageExecutor(wallet, messageExecutionValidator, messageRepository, minedTransactionHandler, walletContractService);
  const {walletService} = await setupWalletService(wallet);
  const deploymentExecutor = new DeploymentExecutor(deploymentRepository, walletService);
  const executionWorker = new ExecutionWorker([messageExecutor, deploymentExecutor], executionQueue, 2);
  return {wallet, actionKey, provider, messageRepository, mockToken, authorisationStore, devicesStore, messageHandler, walletContract, otherWallet, executionWorker, walletContractService, mockTokenNotOwned};
}
