import {expect} from 'chai';
import {Contract, Wallet} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {gnosisSafeAndErc721} from '../../fixtures/walletAndErc721';

describe('GnosisSafe with ERC721', () => {
  let proxy: Contract;
  let erc721: Contract;
  let wallet: Wallet;
  let tokenId: number;

  beforeEach(async () => {
    ({proxy, erc721, wallet, tokenId} = await loadFixture(gnosisSafeAndErc721));
  });

  it('transfer from works', async () => {
    await erc721.transferFrom(wallet.address, proxy.address, tokenId);
    expect(await erc721.balanceOf(proxy.address)).to.eq(1);
  });

  it('safe transfer from works', async () => {
    await erc721.safeTransferFrom(wallet.address, proxy.address, tokenId);
    expect(await erc721.balanceOf(proxy.address)).to.eq(1);
  });
});
