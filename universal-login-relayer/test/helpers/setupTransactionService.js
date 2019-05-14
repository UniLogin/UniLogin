import { EventEmitter } from 'fbemitter';
import { loadFixture } from 'ethereum-waffle';
import TransactionService from '../../lib/services/transactions/TransactionService';
import TransactionQueueService from '../../lib/services/transactions/TransactionQueueService';
import TransactionQueueStore from '../../lib/services/transactions/TransactionQueueStore';
import AuthorisationService from '../../lib/services/authorisationService';
import basicWalletContractWithMockToken from '../fixtures/basicWalletContractWithMockToken';
import PendingExecutionsStore from '../../lib/services/transactions/PendingExecutionsStore';
import PendingExecutions from '../../lib/services/transactions/PendingExecutions';

export default async function setupTransactionService(knex) {
  const { wallet, actionKey, provider, mockToken, walletContract, otherWallet } = await loadFixture(basicWalletContractWithMockToken);
  const hooks = new EventEmitter();
  const authorisationService = new AuthorisationService(knex);
  const pendingExecutionsStore = new PendingExecutionsStore();
  const pendingExecutions = new PendingExecutions(wallet, pendingExecutionsStore);
  const transactionQueueStore = new TransactionQueueStore(knex);
  const transactionQueueService = new TransactionQueueService(wallet, provider, transactionQueueStore);
  const transactionService = new TransactionService(wallet, authorisationService, hooks, provider, transactionQueueService, pendingExecutions);
  return { wallet, actionKey, provider, mockToken, authorisationService, transactionService, walletContract, otherWallet };
}
