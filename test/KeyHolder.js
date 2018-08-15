import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../build/KeyHolder';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import addressToBytes32 from './helpers/utils';
import {utils} from 'ethers';

chai.use(chaiAsPromised);
chai.use(solidity);

const {expect} = chai;

describe('Identity', async () => {
  let provider;
  let wallet;
  let otherWallet;
  let anotherWallet;
  let identity;
  let managementKey;
  let unknownKey;
  let actionKey;
  const MANAGEMENT_KEY = 1;
  const ACTION_KEY = 2;
  const ECDSA_TYPE = 1;
  const newKey = utils.hexlify(utils.randomBytes(32));

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet, anotherWallet] = await getWallets(provider);
    managementKey = addressToBytes32(wallet.address);
    unknownKey = otherWallet.address;
    actionKey = addressToBytes32(anotherWallet.address);
    identity = await deployContract(wallet, KeyHolder, [managementKey]);
  });

  describe('Create', async () => {
    it('should be deployed successfully', async () => {
      const {address} = identity;
      expect(address).to.not.be.null;
    });

    it('key should be management key', async () => {
      const key = await identity.getKey(managementKey);
      expect(key.purpose).to.eq(MANAGEMENT_KEY);
    });

    it('should return the purpose', async () => {
      expect(await identity.keyHasPurpose(managementKey, MANAGEMENT_KEY)).to.be.true;
      expect(await identity.keyHasPurpose(managementKey, ACTION_KEY)).to.be.false;
      expect(await identity.keyHasPurpose(unknownKey, MANAGEMENT_KEY)).to.be.false;
      expect(await identity.keyHasPurpose(managementKey, ACTION_KEY)).to.be.false;
    });
  });

  describe('Add key', async () => {
    it('should add key successfully', async () => {
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
    });

    it('should not allow to add existing key', async () => {
      await expect(identity.addKey(managementKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });

    it('should emit KeyAdded event successfully', async () => {
      await expect(identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE)).to
        .emit(identity, 'KeyAdded')
        .withArgs(utils.hexlify(actionKey), ACTION_KEY, ECDSA_TYPE);
    });

    /* it('should remove key successfully', async () => {
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      const addedKey =
    })*/
    /* it('should set a default MANAGEMENT_KEY', async () => {
      const key = await identity.getKey(acctSha3);
      expect(key.purpose).to.eq('1');
      expect(key.keyType).to.eq('1');
      expect(key.key).to.eq(acctSha3);
    });

    it('should respond to getKeyPurpose', async () => {
      expect(await identity.getKeyPurpose(acctSha3)).to.eq(1);
    });

    it('should respond to getKeysByPurpose', async () => {
      const [key] = await identity.getKeysByPurpose(1);
      expect(key).to.deep.eq(acctSha3);
    });

    it('should add key', async () => {
      await identity.addKey(newKey, 1, 1);
      const {key} = await identity.getKey(newKey);
      expect(key).to.eq(newKey);
    });

    it('should not allow an existing key to be added', async () => {
      await expect(identity.addKey(acctSha3, 1, 1)).to.be.reverted;
    });
    */
    it('should not allow sender without MANAGEMENT_KEY to addKey', async () => {
      const fromOtherWallet = contractWithWallet(identity, otherWallet);
      await expect(fromOtherWallet.addKey(newKey, 1, 1)).to.be.reverted;
    });
  });
});
