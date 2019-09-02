import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {utils} from 'ethers';
import basicKeyHolder from '../../fixtures/basicKeyHolder';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: KeyHolder', async () => {
  let walletContract;
  let unknownWalletKey;
  let fromUnknownWallet;
  let initialPublicKey;
  let publicKey;
  let publicKey2;

  beforeEach(async () => {
    ({walletContract, publicKey, publicKey2, initialPublicKey, unknownWalletKey, fromUnknownWallet} = await loadFixture(basicKeyHolder));
  });

  describe('Create', async () => {
    it('Should be deployed successfully', async () => {
      const {address} = walletContract;
      expect(address).to.not.be.null;
    });

    it('there must be the 1 initial key', async () => {
      expect(await walletContract.keyCount()).to.eq(1);
    });
  });

  describe('Add key', async () => {
    it('Should add key successfully', async () => {
      const expectedKeyCount = (await walletContract.keyCount()).add(1);
      await walletContract.addKey(publicKey);
      expect(await walletContract.keyExist(publicKey)).to.be.true;
      expect(await walletContract.keyCount()).to.eq(expectedKeyCount);
    });

    it('Should not allow to add existing key', async () => {
      await expect(walletContract.addKey(initialPublicKey)).to.be.reverted;
    });

    it('Should emit KeyAdded event successfully', async () => {
      await expect(walletContract.addKey(publicKey)).to
        .emit(walletContract, 'KeyAdded')
        .withArgs(utils.hexlify(publicKey));
    });

    it('Should not allow to add new key with unknown key', async () => {
      await expect(fromUnknownWallet.addKey(unknownWalletKey)).to.be.reverted;
    });
  });

  describe('Add multiple keys', async () => {
    it('Should add multiple keys successfully', async () => {
      const expectedKeyCount = (await walletContract.keyCount()).add(2);
      await walletContract.addKeys([publicKey, publicKey2]);
      expect(await walletContract.keyExist(publicKey)).to.be.true;
      expect(await walletContract.keyExist(publicKey2)).to.be.true;
      expect(await walletContract.keyCount()).to.eq(expectedKeyCount);
    });

    it('Should not allow to add existing key', async () => {
      await expect(walletContract.addKeys([initialPublicKey, publicKey])).to.be.reverted;
    });

    it('Should not allow the same key multiple times', async () => {
      await expect(walletContract.addKeys([publicKey, publicKey])).to.be.reverted;
    });
  });

  describe('keyExist', async () => {
    it('return true if key exist', async () => {
      await walletContract.addKey(publicKey);
      expect(await walletContract.keyExist(publicKey)).to.be.true;
    });

    it('return false if key doesn`t exist', async () => {
      expect(await walletContract.keyExist(unknownWalletKey)).to.be.false;
    });
  });

  describe('Remove key', async () => {
    beforeEach(async () => {
      await walletContract.addKey(publicKey);
    });

    it('Should remove key successfully', async () => {
      const expectedKeyCount = (await walletContract.keyCount()).sub(1);
      expect(await walletContract.keyExist(publicKey)).to.be.true;
      await walletContract.removeKey(publicKey);
      expect(await walletContract.keyExist(publicKey)).to.be.false;
      expect(await walletContract.keyCount()).to.eq(expectedKeyCount);
    });

    it('Should emit KeyRemoved event successfully', async () => {
      expect(await walletContract.keyExist(publicKey)).to.be.true;
      await expect(walletContract.removeKey(publicKey))
        .to.emit(walletContract, 'KeyRemoved');
    });

    it('Should not allow to remove key with unknown key', async () => {
      expect(await walletContract.keyExist(publicKey)).to.be.true;
      await expect(fromUnknownWallet.removeKey(publicKey)).to.be.reverted;
    });
  });
});
