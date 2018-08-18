import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../../build/KeyHolder';
import MochaContract from '../../build/MochaContract';
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
  let mochaContract;

  let managementKey;
  let unknownKey;
  let actionKey;

  const neededApprovals = 1;
  let to;
  const value = 0;
  const data = utils.hexlify(utils.randomBytes(32));

  const addActionKey = () => identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
  const isActionKey = () => identity.keyHasPurpose(actionKey, ACTION_KEY);

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet, anotherWallet] = await getWallets(provider);

    managementKey = addressToBytes32(wallet.address);
    unknownKey = addressToBytes32(otherWallet.address);
    actionKey = addressToBytes32(anotherWallet.address);

    to = otherWallet.address;
    identity = await deployContract(wallet, KeyHolder, [managementKey, neededApprovals]);
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
      await addActionKey();
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
      await expect(addActionKey()).to
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
      await addActionKey();
      const getKeyResult = await identity.getKey(actionKey);
      expect(getKeyResult[0]).to.eq(ACTION_KEY);
      expect(getKeyResult[2]).to.eq(utils.hexlify(actionKey));
    });

    it('should return key purpose correctly', async () => {
      expect(await identity.getKeyPurpose(managementKey)).to.eq(MANAGEMENT_KEY);
      await addActionKey();
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
      await addActionKey();
      expect(await isActionKey()).to.be.true;
      await identity.removeKey(actionKey, ACTION_KEY);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
    });

    it('should emit KeyRemoved event successfully', async () => {
      await addActionKey();
      expect(await isActionKey()).to.be.true;
      await expect(identity.removeKey(actionKey, ACTION_KEY)).to
        .emit(identity, 'KeyRemoved')
        .withArgs(utils.hexlify(actionKey), ACTION_KEY, ECDSA_TYPE);
    });

    it('should remove key from keysByPurpose', async () => {
      await addActionKey();
      const actionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(actionKeys[0]).to.eq(utils.hexlify(actionKey));
      expect(await isActionKey()).to.be.true;
      await identity.removeKey(actionKey, ACTION_KEY);
      expect(await isActionKey()).to.be.false;
      const actualActionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(actualActionKeys[0] !== utils.hexlify(actionKey));
    });

    it('should not allow to remove key without MANAGEMENT_KEY or ACTION_KEY', async () => {
      const fromOtherWallet = await contractWithWallet(identity, otherWallet);
      await addActionKey();
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      await expect(fromOtherWallet.removeKey(actionKey, ACTION_KEY)).to.be.reverted;
    });
  });

  describe('Execute', async () => {
    it('should emit ExecutionRequested event correctly', async () => {
      const id = 0;
      await expect(identity.execute(to, value, data)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(id, to, value, data);
    });

    it('should add executions successfully', async () => {
      const firstNonce = await identity.executionNonce();
      await identity.execute(to, value, data);
      const actualNonce = await identity.executionNonce();
      expect(firstNonce < actualNonce);
      const execution = await identity.executions(firstNonce);
      expect(execution[0]).to.eq(to);
      expect(execution[1]).to.eq(value);
      expect(execution[2]).to.eq(data);
    });

    it('should not allow to add execution without MANAGEMENT_KEY or ACTION_KEY', async () => {
      const fromOtherWallet = await contractWithWallet(identity, otherWallet);
      await expect(fromOtherWallet.addKey(unknownKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });

    it('Fails execute on self if not manangment key', async () => {
      const fromOtherWallet = await contractWithWallet(identity, otherWallet);
      await expect(fromOtherWallet.execute(identity.address, value, data)).to.be.reverted;
    });
  });

  describe('Approve with 1 key needed', async () => {
    const id = 0;
    it('should add approval successfully', async () => {
      await identity.execute(to, value, data);
      await identity.approve(id);
      const execution = await identity.getExecutionApprovals(id);
      expect(execution[0]).to.eq(utils.hexlify(managementKey));
    });

    it('should emit Executed event successfully', async () => {
      await identity.execute(to, value, data);
      await expect(identity.approve(id)).to
        .emit(identity, 'Executed')
        .withArgs(id, to, value, data);
    });

    it('should not allow to confirm without MANAGEMENT_KEY or ACTION_KEY', async () => {
      await identity.execute(to, value, data);
      const fromOtherWallet = await contractWithWallet(identity, otherWallet);
      await expect(fromOtherWallet.approve(id)).to.be.reverted;
    });

    it('should not allow to confirm non-existent execution', async () => {
      await expect(identity.approve(id)).to.be.reverted;
    });
  });

  describe('Do execute', async () => {
    const id = 0;
    let to;
    let functionData;
    beforeEach(async () => {
      mochaContract = await deployContract(wallet, MochaContract);
      functionData = mochaContract.interface.functions.callMe().data;
      to = mochaContract.address;
    });

    it('success call function', async () => {
      await identity.execute(to, value, functionData);
      await identity.approve(id);
      const wasCalled = await mochaContract.getWasCalledValue();
      expect(wasCalled).to.be.true;
    });
    it('Should emit Executed event', async () => {
      await identity.execute(to, value, functionData);
      await expect(identity.approve(id)).to
        .emit(identity, 'Executed')
        .withArgs(id, to, value, functionData);
    });
    xit('no external calls');
    xit('emit ExecutionFailed');
  });

  describe('Approve with 2 keys needed', () => {
    xit('Execute transfer');
    xit('Execute call on self');
    xit('Execute call');
    xit('Will not execute with not enough confirmations');
  });
  xdescribe('Approve with 3 keys needed', () => {
    xit('Will not execute with not enough confirmations');
    xit('Execute transfer');
    xit('Execute call on self');
    xit('Execute call');
  });
});
