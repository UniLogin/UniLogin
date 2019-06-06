import {EventEmitter} from 'fbemitter';
import {loadFixture} from 'ethereum-waffle';
import MessageHandler from '../../lib/services/MessageHandler';
import MessageQueueStore from '../../lib/services/messages/MessageQueueStore';
import AuthorisationService from '../../lib/services/authorisationService';
import basicWalletContractWithMockToken from '../fixtures/basicWalletContractWithMockToken';
import PendingMessagesSQLStore from '../../lib/services/messages/PendingMessagesSQLStore';
import {getContractWhiteList} from '../../lib/utils/relayerUnderTest';

export default async function setupMessageService(knex) {
  const {wallet, actionKey, provider, mockToken, walletContract, otherWallet} = await loadFixture(basicWalletContractWithMockToken);
  const hooks = new EventEmitter();
  const authorisationService = new AuthorisationService(knex);
  const pendingMessagesStore = new PendingMessagesSQLStore(knex);
  const messageQueueStore = new MessageQueueStore(knex);
  const messageHandler = new MessageHandler(wallet, authorisationService, hooks, pendingMessagesStore, messageQueueStore, getContractWhiteList());
  return { wallet, actionKey, provider, mockToken, authorisationService, messageHandler, walletContract, otherWallet };
}
