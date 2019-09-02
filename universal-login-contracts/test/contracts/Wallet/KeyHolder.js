import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {utils} from 'ethers';
import basicKeyHolder from '../../fixtures/basicKeyHolder';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: KeyHolder', async () => {
  let keyHolder;
  let unknownWalletKey;
  let fromUnknownWallet;
  let initialPublicKey;
  let publicKey;
  let publicKey2;

  beforeEach(async () => {
    ({keyHolder, publicKey, publicKey2, initialPublicKey, unknownWalletKey, fromUnknownWallet} = await loadFixture(basicKeyHolder));
  });

  describe('Create', async () => {
    it('Should be deployed successfully', async () => {
      const {address} = keyHolder;
      expect(address).to.not.be.null;
    });

    it('there must be the 1 initial key', async () => {
      expect(await keyHolder.keyCount()).to.eq(1);
    });
  });

  describe('Add key', async () => {
    it('Should add key successfully', async () => {
      const expectedKeyCount = (await keyHolder.keyCount()).add(1);
      await keyHolder.addKey(publicKey);
      expect(await keyHolder.keyExist(publicKey)).to.be.true;
      expect(await keyHolder.keyCount()).to.eq(expectedKeyCount);
    });

    it('Should not allow to add existing key', async () => {
      await expect(keyHolder.addKey(initialPublicKey)).to.be.reverted;
    });

    it('Should emit KeyAdded event successfully', async () => {
      await expect(keyHolder.addKey(publicKey)).to
        .emit(keyHolder, 'KeyAdded')
        .withArgs(utils.hexlify(publicKey));
    });

    it('Should not allow to add new key with unknown key', async () => {
      await expect(fromUnknownWallet.addKey(unknownWalletKey)).to.be.reverted;
    });
  });

  describe('Add multiple keys', async () => {
    it('Should add multiple keys successfully', async () => {
      const expectedKeyCount = (await keyHolder.keyCount()).add(2);
      await keyHolder.addKeys([publicKey, publicKey2]);
      expect(await keyHolder.keyExist(publicKey)).to.be.true;
      expect(await keyHolder.keyExist(publicKey2)).to.be.true;
      expect(await keyHolder.keyCount()).to.eq(expectedKeyCount);
    });

    it('Should not allow to add existing key', async () => {
      await expect(keyHolder.addKeys([initialPublicKey, publicKey])).to.be.reverted;
    });

    it('Should not allow the same key multiple times', async () => {
      await expect(keyHolder.addKeys([publicKey, publicKey])).to.be.reverted;
    });
  });

  describe('keyExist', async () => {
    it('return true if key exist', async () => {
      await keyHolder.addKey(publicKey);
      expect(await keyHolder.keyExist(publicKey)).to.be.true;
    });

    it('return false if key doesn`t exist', async () => {
      expect(await keyHolder.keyExist(unknownWalletKey)).to.be.false;
    });
  });

  describe('Remove key', async () => {
    beforeEach(async () => {
      await keyHolder.addKey(publicKey);
    });

    it('Should remove key successfully', async () => {
      const expectedKeyCount = (await keyHolder.keyCount()).sub(1);
      expect(await keyHolder.keyExist(publicKey)).to.be.true;
      await keyHolder.removeKey(publicKey);
      expect(await keyHolder.keyExist(publicKey)).to.be.false;
      expect(await keyHolder.keyCount()).to.eq(expectedKeyCount);
    });

    it('Should emit KeyRemoved event successfully', async () => {
      expect(await keyHolder.keyExist(publicKey)).to.be.true;
      await expect(keyHolder.removeKey(publicKey))
        .to.emit(keyHolder, 'KeyRemoved');
    });

    it('Should not allow to remove key with unknown key', async () => {
      expect(await keyHolder.keyExist(publicKey)).to.be.true;
      await expect(fromUnknownWallet.removeKey(publicKey)).to.be.reverted;
    });
  });
});
