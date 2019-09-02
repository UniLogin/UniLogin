import KeyHolder from '../../build/KeyHolder.json';
import MockContract from '../../build/MockContract.json';
import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {Provider} from 'ethers/providers';
import {createKeyPair} from '@universal-login/commons';

export default async function basicKeyHolder(
  provider : Provider,
  [unknownWallet, , targetWallet, , , , , wallet]: Wallet[],
) {
  const initialPublicKey = wallet.address;
  const publicKey = createKeyPair().publicKey;
  const publicKey2 = createKeyPair().publicKey;
  const unknownWalletKey = unknownWallet.address;
  const walletContract = await deployContract(wallet, KeyHolder, [initialPublicKey]);
  const mockContract = await deployContract(wallet, MockContract);
  const fromUnknownWallet = await walletContract.connect(unknownWallet);
  await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  return {provider, walletContract, mockContract, wallet,
    targetWallet, publicKey, publicKey2, initialPublicKey, unknownWalletKey, fromUnknownWallet,
  };
}
