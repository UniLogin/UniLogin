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
  let managementKey;
  let actionKey;
  let actionKey2;

  const addActionKey = () => walletContract.addKey(actionKey);

  beforeEach(async () => {
    ({walletContract, actionKey, actionKey2, managementKey, unknownWalletKey, fromUnknownWallet} = await loadFixture(basicKeyHolder));
  });

  describe('Create', async () => {
    it('Should be deployed successfully', async () => {
      const {address} = walletContract;
      expect(address).to.not.be.null;
    });

    it('there must be a total of 3 keys', async () => {
      expect(await walletContract.keyCount()).to.eq(3);
    });
  });

  describe('Add key', async () => {
    it('Should add key successfully', async () => {
      await addActionKey();
      expect(await walletContract.keyExist(actionKey)).to.be.true;
      expect(await walletContract.keyCount()).to.eq(4);
    });

    it('Should not allow to add existing key', async () => {
      await expect(walletContract.addKey(managementKey)).to.be.reverted;
    });

    it('Should emit KeyAdded event successfully', async () => {
      await expect(addActionKey()).to
        .emit(walletContract, 'KeyAdded')
        .withArgs(utils.hexlify(actionKey));
    });

    it('Should not allow to add new key with unknown key', async () => {
      await expect(fromUnknownWallet.addKey(unknownWalletKey)).to.be.reverted;
    });
  });

  describe('Add multiple keys', async () => {
    it('Should add multiple keys successfully', async () => {
      await walletContract.addKeys([actionKey, actionKey2]);
      expect(await walletContract.keyExist(actionKey)).to.be.true;
      expect(await walletContract.keyExist(actionKey2)).to.be.true;
      expect(await walletContract.keyCount()).to.eq(5);
    });

    it('Should not allow to add existing key', async () => {
      await expect(walletContract.addKeys([managementKey, actionKey])).to.be.reverted;
    });

    it('Should not allow the same key multiple times', async () => {
      await expect(walletContract.addKeys([actionKey, actionKey])).to.be.reverted;
    });
  });

  describe('keyExist', async () => {
    it('return true if key exist', async () => {
      await addActionKey();
      expect(await walletContract.keyExist(actionKey)).to.be.true;
    });

    it('return false if key doesn`t exist', async () => {
      expect(await walletContract.keyExist(unknownWalletKey)).to.be.false;
    });
  });

  describe('Remove key', async () => {
    beforeEach(async () => {
      await addActionKey();
      expect(await walletContract.keyCount()).to.eq(4);
    });

    it('Should remove key successfully', async () => {
      expect(await walletContract.keyExist(actionKey)).to.be.true;
      await walletContract.removeKey(actionKey);
      expect(await walletContract.keyExist(actionKey)).to.be.false;
      expect(await walletContract.keyCount()).to.eq(3);
    });

    it('Should emit KeyRemoved event successfully', async () => {
      expect(await walletContract.keyExist(actionKey)).to.be.true;
      await expect(walletContract.removeKey(actionKey))
        .to.emit(walletContract, 'KeyRemoved');
    });

    it('Should not allow to remove key with unknown key', async () => {
      expect(await walletContract.keyExist(actionKey)).to.be.true;
      await expect(fromUnknownWallet.removeKey(actionKey)).to.be.reverted;
    });
  });
});
