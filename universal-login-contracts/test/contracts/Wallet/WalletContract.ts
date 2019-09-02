import {expect} from 'chai';
import {Contract, Wallet} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {walletAndErc721} from '../../fixtures/walletAndErc721';

describe('WalletContract with ERC721', () => {
  let proxyWallet: Contract;
  let erc721: Contract;
  let wallet: Wallet;
  let tokenId: number;

  beforeEach(async () => {
    ({proxyWallet, erc721, wallet, tokenId} = await loadFixture(walletAndErc721));
  });

  it('transfer from works', async () => {
    await erc721.transferFrom(wallet.address, proxyWallet.address, tokenId);
    expect(await erc721.balanceOf(proxyWallet.address)).to.eq(1);
  });

  it('safe transfer from works', async () => {
    await erc721.safeTransferFrom(wallet.address, proxyWallet.address, tokenId);
    expect(await erc721.balanceOf(proxyWallet.address)).to.eq(1);
  });
});
