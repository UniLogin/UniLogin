import {expect} from 'chai';
import {Contract, Wallet, utils} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {signString} from '@universal-login/commons';
import {walletAndErc721} from '../fixtures/walletAndErc721';
import {walletContractFixture} from '../fixtures/walletContract';

describe('WalletContract', () => {
  describe('ERC721', () => {
    let walletContract: Contract;
    let erc721: Contract;
    let wallet: Wallet;
    let tokenId: number;

    beforeEach(async () => {
      ({walletContract, erc721, wallet, tokenId} = await loadFixture(walletAndErc721));
    });

    it('transfer from works', async () => {
      await erc721.transferFrom(wallet.address, walletContract.address, tokenId);
      expect(await erc721.balanceOf(walletContract.address)).to.eq(1);
    });

    it('safe transfer from works', async () => {
      await erc721.safeTransferFrom(wallet.address, walletContract.address, tokenId);
      expect(await erc721.balanceOf(walletContract.address)).to.eq(1);
    });
  });

  describe('isValidSignature', () => {
    it('returns true if signer has the permission', async () => {
      const {walletContract, keyPair} = await loadFixture(walletContractFixture);
      const message = 'Hi, I am Justyna';
      const messageHex = utils.hexlify(utils.toUtf8Bytes(message));
      const signature = signString(message, keyPair.privateKey);
      expect(await walletContract.isValidSignature(messageHex, signature)).to.be.true;
    });
  });
});
