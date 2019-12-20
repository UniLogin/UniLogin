import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {beta2} from '@universal-login/contracts';
import {executeAddKey} from '@universal-login/contracts/testutils';
import createWalletContract from '../testhelpers/createWalletContract';
import {buildEnsService} from '../testhelpers/buildEnsService';

export default async function basicWalletContractWithMockToken(_, wallets) {
  const [, otherWallet, wallet] = wallets;
  const [, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const {master, proxy: walletContract} = await createWalletContract(wallet);
  const actionWallet = Wallet.createRandom();
  const actionKey = actionWallet.privateKey;
  const mockToken = await deployContract(wallet, beta2.MockToken);
  await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  await mockToken.transfer(walletContract.address, utils.parseEther('1.0'));
  await executeAddKey(walletContract, actionWallet.address, wallet.privateKey);
  return {wallet, actionKey, provider, mockToken, master, walletContract, otherWallet};
}
