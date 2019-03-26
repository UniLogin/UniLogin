import KeyHolder from '../../build/KeyHolder.json';
import MockContract from '../../build/MockContract.json';
import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {MANAGEMENT_KEY, ACTION_KEY} from '../../lib/consts';
import { Provider } from 'ethers/providers';

export default async function basicKeyHolder(
  provider : Provider,
  [managementWallet, actionWallet, unknownWallet, anotherWallet, targetWallet, anotherWallet2, , , , wallet]: Wallet[],
) {
  const managementKey = wallet.address;
  const managementWalletKey = managementWallet.address;
  const actionWalletKey = actionWallet.address;
  const actionKey = anotherWallet.address;
  const actionKey2 = anotherWallet2.address;
  const unknownWalletKey = unknownWallet.address;
  const walletContract = await deployContract(wallet, KeyHolder, [managementKey]);
  const mockContract = await deployContract(wallet, MockContract);
  const fromManagementWallet = await walletContract.connect(managementWallet);
  const fromActionWallet = await walletContract.connect(actionWallet);
  const fromUnknownWallet = await walletContract.connect(unknownWallet);

  await walletContract.addKey(managementWalletKey, MANAGEMENT_KEY);
  await walletContract.addKey(actionWalletKey, ACTION_KEY);
  await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  return {provider, identity: walletContract, mockContract, wallet,
    targetWallet, actionKey, actionKey2, managementKey, unknownWalletKey, managementWalletKey,
    fromManagementWallet, fromActionWallet, fromUnknownWallet,
  };
}
