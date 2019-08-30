import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY} from '@universal-login/commons';
import basicKeyHolder from '../fixtures/basicKeyHolder';

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
  const isKey = () => walletContract.keyHasPurpose(actionKey, MANAGEMENT_KEY);

  beforeEach(async () => {
    ({walletContract, actionKey, actionKey2, managementKey, unknownWalletKey, fromUnknownWallet} = await loadFixture(basicKeyHolder));
  });

  describe('Create', async () => {
    it('Should be deployed successfully', async () => {
      const {address} = walletContract;
      expect(address).to.not.be.null;
    });

    it('Key should be management key', async () => {
      expect(await walletContract.keyExist(managementKey)).to.be.true;
    });

    it('there must be a total of 3 keys', async () => {
      expect(await walletContract.keyCount()).to.eq(3);
    });

    it('Should return the purpose', async () => {
      expect(await walletContract.keyHasPurpose(managementKey, MANAGEMENT_KEY)).to.be.true;
      expect(await walletContract.keyHasPurpose(managementKey, ACTION_KEY)).to.be.false;
      expect(await walletContract.keyHasPurpose(actionKey, MANAGEMENT_KEY)).to.be.false;
      expect(await walletContract.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
    });
  });

  describe('Add key', async () => {
    it('Should add key successfully', async () => {
      await addActionKey();
      expect(await isKey()).to.be.true;
      const existingKeys = await walletContract.keys(actionKey);
      expect(existingKeys[0]).to.eq(MANAGEMENT_KEY);
      expect(existingKeys[1]).to.eq(utils.hexlify(actionKey));
      expect(await walletContract.keyCount()).to.eq(4);
    });

    it('Should not allow to add existing key', async () => {
      await expect(walletContract.addKey(managementKey)).to.be.reverted;
    });

    it('Should emit KeyAdded event successfully', async () => {
      await expect(addActionKey()).to
        .emit(walletContract, 'KeyAdded')
        .withArgs(utils.hexlify(actionKey), MANAGEMENT_KEY);
    });

    it('Should not allow to add new key with unknown key', async () => {
      await expect(fromUnknownWallet.addKey(unknownWalletKey)).to.be.reverted;
    });
  });

  describe('Add multiple keys', async () => {
    it('Should add multiple keys successfully', async () => {
      await walletContract.addKeys([actionKey, actionKey2]);
      expect(await walletContract.keyHasPurpose(actionKey2, MANAGEMENT_KEY)).to.be.true;
      const existingKeys = await walletContract.keys(actionKey);
      expect(existingKeys[0]).to.eq(MANAGEMENT_KEY);
      expect(existingKeys[1]).to.eq(utils.hexlify(actionKey));
      const existingKeys2 = await walletContract.keys(actionKey2);
      expect(existingKeys2[0]).to.eq(MANAGEMENT_KEY);
      expect(existingKeys2[1]).to.eq(utils.hexlify(actionKey2));
      expect(await walletContract.keyCount()).to.eq(5);
    });

    it('Should not allow to add existing key', async () => {
      await expect(walletContract.addKeys([managementKey, actionKey])).to.be.reverted;
    });

    it('Should not allow the same key multiple times', async () => {
      await expect(walletContract.addKeys([actionKey, actionKey])).to.be.reverted;
    });
  });

  describe('Get key', async () => {
    it('Should return key correctly', async () => {
      await addActionKey();
      expect(await walletContract.keyExist(actionKey)).to.be.true;
      expect(await walletContract.keyExist(actionKey)).to.eq(true);
    });

    it('Should return key purpose correctly', async () => {
      expect(await walletContract.keyExist(managementKey)).to.be.true;
      await addActionKey();
      expect(await walletContract.keyExist(actionKey)).to.be.true;
    });
  });

  describe('Remove key', async () => {
    beforeEach(async () => {
      await addActionKey();
      expect(await walletContract.keyCount()).to.eq(4);
    });

    it('Should remove key successfully', async () => {
      expect(await isKey()).to.be.true;
      await walletContract.removeKey(actionKey, MANAGEMENT_KEY);
      expect(await walletContract.keyHasPurpose(actionKey, MANAGEMENT_KEY)).to.be.false;
      expect(await walletContract.keyCount()).to.eq(3);
    });

    it('Should emit KeyRemoved event successfully', async () => {
      expect(await isKey()).to.be.true;
      await expect(walletContract.removeKey(actionKey, MANAGEMENT_KEY)).to
        .emit(walletContract, 'KeyRemoved')
        .withArgs(utils.hexlify(actionKey), MANAGEMENT_KEY);
    });

    it('Should not allow to remove key with unknown key', async () => {
      expect(await isKey()).to.be.true;
      await expect(fromUnknownWallet.removeKey(actionKey, MANAGEMENT_KEY)).to.be.reverted;
    });
  });
});
