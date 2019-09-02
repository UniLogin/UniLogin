import KeyHolder from '../../build/KeyHolder.json';
import {Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {Provider} from 'ethers/providers';
import {createKeyPair} from '@universal-login/commons';

export default async function basicKeyHolder(
  provider : Provider,
  [unknownWallet, , , , , , , wallet]: Wallet[],
) {
  const initialPublicKey = wallet.address;
  const publicKey = createKeyPair().publicKey;
  const publicKey2 = createKeyPair().publicKey;
  const unknownWalletKey = unknownWallet.address;
  const walletContract = await deployContract(wallet, KeyHolder, [initialPublicKey]);
  const fromUnknownWallet = await walletContract.connect(unknownWallet);
  return {provider, walletContract, wallet, publicKey, publicKey2, initialPublicKey, unknownWalletKey, fromUnknownWallet};
}
