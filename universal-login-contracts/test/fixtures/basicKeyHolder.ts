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
  const identity = await deployContract(wallet, KeyHolder, [managementKey]);
  const mockContract = await deployContract(wallet, MockContract);
  const fromManagementWallet = await identity.connect(managementWallet);
  const fromActionWallet = await identity.connect(actionWallet);
  const fromUnknownWallet = await identity.connect(unknownWallet);

  await identity.addKey(managementWalletKey, MANAGEMENT_KEY);
  await identity.addKey(actionWalletKey, ACTION_KEY);
  await wallet.sendTransaction({to: identity.address, value: utils.parseEther('1.0')});
  return {provider, identity, mockContract, wallet,
    targetWallet, actionKey, actionKey2, managementKey, unknownWalletKey, managementWalletKey,
    fromManagementWallet, fromActionWallet, fromUnknownWallet,
  };
}
