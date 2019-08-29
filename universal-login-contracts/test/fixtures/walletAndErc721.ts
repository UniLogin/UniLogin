import {providers, Wallet} from 'ethers';
import {setupWalletContract} from './walletContract';
import {deployContract} from 'ethereum-waffle';
import MockNFToken from '../../build/MockNFToken.json';

export async function walletAndErc721(provider: providers.Provider, [wallet]: Wallet[]) {
  const {proxyWallet} = await setupWalletContract(wallet);
  const erc721 = await deployContract(wallet, MockNFToken);
  const tokenId = 1;
  await erc721.mint(wallet.address, tokenId);
  return {proxyWallet, erc721, wallet, tokenId};
}
