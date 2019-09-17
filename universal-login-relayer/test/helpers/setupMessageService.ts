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
import IMessageValidator from '../../lib/core/services/validators/IMessageValidator';
import MessageValidator from '../../lib/integration/ethereum/validators/MessageValidator';
import MessageExecutor from '../../lib/integration/ethereum/MessageExecutor';
import {DevicesStore} from '../../lib/integration/sql/services/DevicesStore';
import {DevicesService} from '../../lib/core/services/DevicesService';
import WalletMasterContractService from '../../lib/integration/ethereum/services/WalletMasterContractService';

export default async function setupMessageService(knex: Knex) {
  const {wallet, actionKey, provider, mockToken, walletContract, otherWallet} = await loadFixture(basicWalletContractWithMockToken);
  const hooks = new EventEmitter();
  const authorisationStore = new AuthorisationStore(knex);
  const messageRepository = new MessageSQLRepository(knex);
  const devicesStore = new DevicesStore(knex);
  const queueStore = new QueueSQLStore(knex);
  const walletMasterContractService = new WalletMasterContractService(provider);
  const devicesService = new DevicesService(devicesStore, walletMasterContractService);
  const signaturesService = new SignaturesService(wallet);
  const statusService = new MessageStatusService(messageRepository, signaturesService);
  const messageValidator: IMessageValidator = new MessageValidator(wallet, getContractWhiteList());
  const messageExecutor = new MessageExecutor(wallet, messageValidator);
  const messageHandler = new MessageHandler(wallet, authorisationStore, devicesService, hooks, messageRepository, queueStore, messageExecutor, statusService);
  return { wallet, actionKey, provider, mockToken, authorisationStore, devicesStore, messageHandler, walletContract, otherWallet };
}
