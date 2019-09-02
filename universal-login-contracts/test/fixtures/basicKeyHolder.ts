import KeyHolder from '../../build/KeyHolder.json';
import MockContract from '../../build/MockContract.json';
import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {Provider} from 'ethers/providers';

export default async function basicKeyHolder(
  provider : Provider,
  [actionWallet, unknownWallet, anotherWallet, targetWallet, anotherWallet2, , , , wallet]: Wallet[],
) {
  const initialPublicKey = wallet.address;
  const actionWalletKey = actionWallet.address;
  const publicKey = anotherWallet.address;
  const publicKey2 = anotherWallet2.address;
  const unknownWalletKey = unknownWallet.address;
  const walletContract = await deployContract(wallet, KeyHolder, [initialPublicKey]);
  const mockContract = await deployContract(wallet, MockContract);
  const fromActionWallet = await walletContract.connect(actionWallet);
  const fromUnknownWallet = await walletContract.connect(unknownWallet);
  await walletContract.addKey(actionWalletKey);
  await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  return {provider, walletContract, mockContract, wallet,
    targetWallet, publicKey, publicKey2, initialPublicKey, unknownWalletKey,
    fromActionWallet, fromUnknownWallet,
  };
}
