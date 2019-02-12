import ERC725ApprovalScheme from '../../build/ERC725ApprovalScheme.json';
import MockContract from '../../build/MockContract.json';
import {utils, Wallet} from 'ethers';
import {deployContract, getWallets} from 'ethereum-waffle';
import {addressToBytes32} from '../utils';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../lib/consts';
import { Provider } from 'ethers/providers';

export default async function basicERC725(provider : Provider, [, , , , , , , , , wallet]: Wallet[]) {
  const [managementWallet, actionWallet, unknownWallet, anotherWallet, targetWallet, anotherWallet2] = await getWallets(provider);
  const managementKey = addressToBytes32(wallet.address);
  const managementWalletKey = addressToBytes32(managementWallet.address);
  const actionWalletKey = addressToBytes32(actionWallet.address);
  const actionKey = addressToBytes32(anotherWallet.address);
  const actionKey2 = addressToBytes32(anotherWallet2.address);
  const unknownWalletKey = addressToBytes32(unknownWallet.address);
  const identity = await deployContract(wallet, ERC725ApprovalScheme, [managementKey]);
  const mockContract = await deployContract(wallet, MockContract);
  const fromManagementWallet = await identity.connect(managementWallet);
  const fromActionWallet = await identity.connect(actionWallet);
  const fromUnknownWallet = await identity.connect(unknownWallet);

  await identity.addKey(managementWalletKey, MANAGEMENT_KEY, ECDSA_TYPE);
  await identity.addKey(actionWalletKey, ACTION_KEY, ECDSA_TYPE);
  await wallet.sendTransaction({to: identity.address, value: utils.parseEther('1.0')});
  return {provider, identity, mockContract, wallet,
    targetWallet, actionKey, actionKey2, managementKey, unknownWalletKey, managementWalletKey,
    fromManagementWallet, fromActionWallet, fromUnknownWallet,
  };
}
