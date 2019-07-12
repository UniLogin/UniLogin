import {EventEmitter} from 'fbemitter';
import {loadFixture} from 'ethereum-waffle';
import MessageHandler from '../../lib/core/services/MessageHandler';
import QueueSQLStore from '../../lib/integration/sql/services/QueueSQLStore';
import AuthorisationStore from '../../lib/integration/sql/services/AuthorisationStore';
import basicWalletContractWithMockToken from '../fixtures/basicWalletContractWithMockToken';
import PendingMessagesSQLStore from '../../lib/integration/sql/services/PendingMessagesSQLStore';
import {getContractWhiteList} from '../../lib/http/relayers/RelayerUnderTest';

export default async function setupMessageService(knex) {
  const {wallet, actionKey, provider, mockToken, walletContract, otherWallet} = await loadFixture(basicWalletContractWithMockToken);
  const hooks = new EventEmitter();
  const authorisationStore = new AuthorisationStore(knex);
  const pendingMessagesStore = new PendingMessagesSQLStore(knex);
  const queueStore = new QueueSQLStore(knex);
  const messageHandler = new MessageHandler(wallet, authorisationStore, hooks, pendingMessagesStore, queueStore, getContractWhiteList());
  return { wallet, actionKey, provider, mockToken, authorisationStore, messageHandler, walletContract, otherWallet };
}
