import {EventEmitter} from 'fbemitter';
import sinon from 'sinon';
import {loadFixture} from 'ethereum-waffle';
import WalletService from '../../lib/services/WalletService';
import basicWalletContract from '../fixtures/basicWalletContract';


export default async function setupWalletService() {
  const {wallet, walletContract, provider, ensService, walletMasterAddress, factoryContractAddress} = await loadFixture(basicWalletContract);
  const hooks = new EventEmitter();
  const config = {walletMasterAddress, factoryAddress: factoryContractAddress, supportedTokens: []};
  const walletService = new WalletService(wallet, config, ensService, hooks);
  const callback = sinon.spy();
  hooks.addListener('created', callback);
  return {wallet, provider, walletService, callback, walletContract};
}
