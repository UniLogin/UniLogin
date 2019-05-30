import {EventEmitter} from 'fbemitter';
import {loadFixture} from 'ethereum-waffle';
import MessageHandler from '../../lib/services/MessageHandler';
import TransactionQueueService from '../../lib/services/transactions/TransactionQueueService';
import TransactionQueueStore from '../../lib/services/transactions/TransactionQueueStore';
import AuthorisationService from '../../lib/services/authorisationService';
import basicWalletContractWithMockToken from '../fixtures/basicWalletContractWithMockToken';
import PendingMessagesSQLStore from '../../lib/services/messages/PendingMessagesSQLStore';
import PendingMessages from '../../lib/services/messages/PendingMessages';

export default async function setupTransactionService(knex) {
  const {wallet, actionKey, provider, mockToken, walletContract, otherWallet} = await loadFixture(basicWalletContractWithMockToken);
  const hooks = new EventEmitter();
  const authorisationService = new AuthorisationService(knex);
  const pendingMessagesStore = new PendingMessagesSQLStore(knex);
  const pendingMessages = new PendingMessages(wallet, pendingMessagesStore);
  const transactionQueueStore = new TransactionQueueStore(knex);
  const transactionQueueService = new TransactionQueueService(wallet, provider, transactionQueueStore);
  const messageHandler = new MessageHandler(wallet, authorisationService, hooks, transactionQueueService, pendingMessages);
  return { wallet, actionKey, provider, mockToken, authorisationService, messageHandler, walletContract, otherWallet };
}
