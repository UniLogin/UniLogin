import {EventEmitter} from 'fbemitter';
import {utils, Wallet} from 'ethers';
import {deployContract, getWallets} from 'ethereum-waffle';
import {waitForContractDeploy} from '@universal-login/commons';
import {ACTION_KEY} from '@universal-login/contracts';
import MockToken from '@universal-login/contracts/build/MockToken';
import WalletContract from '@universal-login/contracts/build/Wallet';
import WalletService from '../../lib/services/WalletService';
import buildEnsService from '../helpers/buildEnsService';


export default async function basicWalletService(provider, [, , wallet]) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const hooks = new EventEmitter();
  const walletContract = await getWalletContract(wallet, hooks, ensService);
  const actionWallet = Wallet.createRandom();
  const actionKey = actionWallet.privateKey;
  const mockToken = await deployContract(wallet, MockToken);
  await walletContract.addKey(actionWallet.address, ACTION_KEY);
  await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  await mockToken.transfer(walletContract.address, utils.parseEther('1.0'));
  const [, otherWallet] = await getWallets(provider);
  return {wallet, actionKey, provider, mockToken, walletContract, otherWallet, hooks};
}

async function getWalletContract(wallet, hooks, ensService) {
  const walletService = new WalletService(wallet, null, ensService, hooks, true);
  const transaction = await walletService.create(wallet.address, 'alex.mylogin.eth');
  return waitForContractDeploy(wallet, WalletContract, transaction.hash);
}
