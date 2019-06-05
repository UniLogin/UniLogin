import {EventEmitter} from 'fbemitter';
import {loadFixture} from 'ethereum-waffle';
import MessageHandler from '../../lib/services/MessageHandler';
import TransactionQueueStore from '../../lib/services/transactions/TransactionQueueStore';
import AuthorisationService from '../../lib/services/authorisationService';
import basicWalletContractWithMockToken from '../fixtures/basicWalletContractWithMockToken';
import PendingMessagesSQLStore from '../../lib/services/messages/PendingMessagesSQLStore';
import {getContractWhiteList} from '../../lib/utils/relayerUnderTest';

export default async function setupTransactionService(knex) {
  const {wallet, actionKey, provider, mockToken, walletContract, otherWallet} = await loadFixture(basicWalletContractWithMockToken);
  const hooks = new EventEmitter();
  const authorisationService = new AuthorisationService(knex);
  const pendingMessagesStore = new PendingMessagesSQLStore(knex);
  const transactionQueueStore = new TransactionQueueStore(knex);
  const messageHandler = new MessageHandler(wallet, authorisationService, hooks, pendingMessagesStore, transactionQueueStore, getContractWhiteList(), provider);
  return { wallet, actionKey, provider, mockToken, authorisationService, messageHandler, walletContract, otherWallet };
}
