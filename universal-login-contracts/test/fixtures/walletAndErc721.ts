import {providers, Wallet} from 'ethers';
import {setupWalletContract} from './walletContract';
import {deployContract} from 'ethereum-waffle';
import MockNFToken from '../../build/MockNFToken.json';

export async function walletAndErc721(provider: providers.Provider, [wallet, wallet2]: Wallet[]) {
  const {walletContract} = await setupWalletContract(wallet, wallet2);
  const erc721 = await deployContract(wallet, MockNFToken);
  const tokenId = 1;
  await erc721.mint(wallet.address, tokenId);
  return {walletContract, erc721, wallet, tokenId};
}
