import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../../build/KeyHolder';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import addressToBytes32 from '../helpers/utils';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../lib/sdk/index';

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
  let executionAddress;
  const executionValue = 0;
  const executionId = 0;
  const executionData = utils.hexlify(utils.randomBytes(32));

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet, anotherWallet] = await getWallets(provider);
    managementKey = addressToBytes32(wallet.address);
    unknownKey = addressToBytes32(otherWallet.address);
    actionKey = addressToBytes32(anotherWallet.address);
    executionAddress = otherWallet.address;
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
      expect(await identity.keyHasPurpose(actionKey, MANAGEMENT_KEY)).to.be.false;
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
    });
  });

  describe('Add key', async () => {
    it('should add key successfully', async () => {
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      const existingKeys = await identity.keys(actionKey);
      expect(existingKeys[0]).to.eq(ACTION_KEY);
      expect(existingKeys[1]).to.eq(ECDSA_TYPE);
      expect(existingKeys[2]).to.eq(utils.hexlify(actionKey));
    });

    it('should not allow to add existing key', async () => {
      await expect(identity.addKey(managementKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });

    it('should emit KeyAdded event successfully', async () => {
      await expect(identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE)).to
        .emit(identity, 'KeyAdded')
        .withArgs(utils.hexlify(actionKey), ACTION_KEY, ECDSA_TYPE);
    });

    it('should not allow to add new key without MANAGEMENT_KEY', async () => {
      const fromOtherWallet = await contractWithWallet(identity, otherWallet);
      await expect(fromOtherWallet.addKey(unknownKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });
  });

  describe('Get key', async () => {
    it('should return key correctly', async () => {
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      const getKeyResult = await identity.getKey(actionKey);
      expect(getKeyResult[0]).to.eq(ACTION_KEY);
      expect(getKeyResult[2]).to.eq(utils.hexlify(actionKey));
    });

    it('should return key purpose correctly', async () => {
      expect(await identity.getKeyPurpose(managementKey)).to.eq(MANAGEMENT_KEY);
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      expect(await identity.getKeyPurpose(actionKey)).to.eq(ACTION_KEY);
    });

    it('should return keys by purpose correctly', async () => {
      const actualManagementKeys = await identity.getKeysByPurpose(MANAGEMENT_KEY);
      expect(actualManagementKeys[0]).to.eq(utils.hexlify(managementKey));
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      const actualActionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(actualActionKeys[0]).to.eq(utils.hexlify(actionKey));
    });
  });

  describe('Remove key', async () => {
    it('should remove key successfully', async () => {
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      await identity.removeKey(actionKey, ACTION_KEY);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
    });

    it('should emit KeyRemoved event successfully', async () => {
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      await expect(identity.removeKey(actionKey, ACTION_KEY)).to
        .emit(identity, 'KeyRemoved')
        .withArgs(utils.hexlify(actionKey), ACTION_KEY, ECDSA_TYPE);
    });

    it('should remove key from keysByPurpose', async () => {
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      const beforeRemoveActionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(beforeRemoveActionKeys[0]).to.eq(utils.hexlify(actionKey));
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      await identity.removeKey(actionKey, ACTION_KEY);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
      const afterRemoceActionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(afterRemoceActionKeys[0] !== utils.hexlify(actionKey));
    });

    it('should not allow to remove key without MANAGEMENT_KEY or ACTION_KEY', async () => {
      const fromOtherWallet = await contractWithWallet(identity, otherWallet);
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      await expect(fromOtherWallet.removeKey(actionKey, ACTION_KEY)).to.be.reverted;
    });
  });

  describe('Execute', async () => {
    it('should emit ExecutionRequested event correctly', async () => {
      await expect(identity.execute(executionAddress, executionValue, executionData)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(executionId, executionAddress, executionValue, executionData);
    });

    it('should add executions successfully', async () => {
      const beforeAddExecutionNonce = await identity.executionNonce();
      await identity.execute(executionAddress, executionValue, executionData);
      const afterAddExecutionNonce = await identity.executionNonce();
      expect(beforeAddExecutionNonce < afterAddExecutionNonce);
      const execution = await identity.executions(beforeAddExecutionNonce);
      expect(execution[0]).to.eq(executionAddress);
      expect(execution[1]).to.eq(executionValue);
      expect(execution[2]).to.eq(executionData);
    });

    it('should not allow to add execution without MANAGEMENT_KEY or ACTION_KEY', async () => {
      const fromOtherWallet = await contractWithWallet(identity, otherWallet);
      await expect(fromOtherWallet.addKey(unknownKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });
  });
});
