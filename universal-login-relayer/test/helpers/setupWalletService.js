import { EventEmitter } from 'fbemitter';
import sinon from 'sinon';
import { createFixtureLoader, createMockProvider } from 'ethereum-waffle';
import WalletService from '../../lib/services/WalletService';
import basicWalletContract from '../fixtures/basicWalletContract';


export default async function setupWalletService() {
  const { wallet, walletContract, provider, ensService } = await createFixtureLoader(createMockProvider())(basicWalletContract); // TODO update ethereum-waffle and use loadFixture
  const hooks = new EventEmitter();
  const walletService = new WalletService(wallet, null, ensService, hooks, true);
  const callback = sinon.spy();
  hooks.addListener('created', callback);
  return {wallet, provider, walletService, callback, walletContract};
}
