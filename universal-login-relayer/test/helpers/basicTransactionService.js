import {loadFixture} from 'ethereum-waffle';
import TransactionService from '../../lib/services/transactions/TransactionService';
import TransactionQueueService from '../../lib/services/transactions/TransactionQueueService';
import TransactionQueueStore from '../../lib/services/transactions/TransactionQueueStore';
import AuthorisationService from '../../lib/services/authorisationService';
import basicWalletService from '../fixtures/basicWalletService';

export default async function setupTransactionService(knex) {
  const {wallet, actionKey, ensService, provider, walletService, mockToken, mockContract, walletContract, otherWallet, hooks, callback} = await loadFixture(basicWalletService);
  const authorisationService = new AuthorisationService(knex);
  const transactionQueueStore = new TransactionQueueStore(knex);
  const transactionQueueService = new TransactionQueueService(wallet, provider, transactionQueueStore);
  const transactionService = new TransactionService(wallet, authorisationService, hooks, provider, transactionQueueService);
  return {wallet, actionKey, ensService, provider, walletService, callback, mockToken, mockContract, authorisationService, transactionService, walletContract, otherWallet, knex};
}
