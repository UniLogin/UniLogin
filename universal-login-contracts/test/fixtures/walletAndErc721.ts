import {providers, Wallet} from 'ethers';
import {setupWalletContract} from './walletContract';
import {deployContract} from 'ethereum-waffle';
import MockNFToken from '../../dist/contracts/MockNFToken.json';
import {setupGnosisSafeContract} from './gnosisSafe';

export async function walletAndErc721(provider: providers.Provider, [wallet]: Wallet[]) {
  const {proxyWallet} = await setupWalletContract(wallet);
  const {erc721, tokenId} = await setupERC721(wallet);
  return {proxyWallet, erc721, wallet, tokenId};
}

export async function setupERC721(wallet: Wallet) {
  const erc721 = await deployContract(wallet, MockNFToken);
  const tokenId = 1;
  await erc721.mint(wallet.address, tokenId);
  return {erc721, tokenId};
}

export async function gnosisSafeAndErc721(provider: providers.Provider, [wallet]: Wallet[]) {
  const {proxy} = await setupGnosisSafeContract(wallet);
  const {erc721, tokenId} = await setupERC721(wallet);
  return {proxy, erc721, tokenId, wallet};
}
