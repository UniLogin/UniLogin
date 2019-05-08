import {utils, Wallet} from 'ethers';
import {deployContract, getWallets} from 'ethereum-waffle';
import {ACTION_KEY} from '@universal-login/contracts';
import MockToken from '@universal-login/contracts/build/MockToken';
import createWalletContract from '../helpers/createWalletContract';

export default async function basicWalletService(provider, [, , wallet]) {
  const { walletContract, provider } = await createWalletContract(wallet);
  const actionWallet = Wallet.createRandom();
  const actionKey = actionWallet.privateKey;
  const mockToken = await deployContract(wallet, MockToken);
  await walletContract.addKey(actionWallet.address, ACTION_KEY);
  await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  await mockToken.transfer(walletContract.address, utils.parseEther('1.0'));
  const [, otherWallet] = await getWallets(provider);
  return {wallet, actionKey, provider, mockToken, walletContract, otherWallet};
}
