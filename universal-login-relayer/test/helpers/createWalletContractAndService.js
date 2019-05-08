import {EventEmitter} from 'fbemitter';
import {waitForContractDeploy} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/Wallet';
import WalletService from '../../lib/services/WalletService';
import buildEnsService from '../helpers/buildEnsService';

export default async function createWalletContractAndService(wallet) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const hooks = new EventEmitter();
  const walletService = new WalletService(wallet, null, ensService, hooks, true);
  const transaction = await walletService.create(wallet.address, 'alex.mylogin.eth');
  const walletContract = await waitForContractDeploy(wallet, WalletContract, transaction.hash);
  return { walletContract, walletService, provider, hooks};
}
