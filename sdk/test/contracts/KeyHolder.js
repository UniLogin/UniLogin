import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../../build/KeyHolder';
import MockContract from '../../build/MockContract';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import {addressToBytes32} from '../../lib/utils/utils';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../lib/sdk/sdk';

chai.use(chaiAsPromised);
chai.use(solidity);

const {expect} = chai;

describe('Contract - yarn test -Identity', async () => {
  let provider;
  let wallet;
  let otherWallet;
  let anotherWallet;

  let identity;
  let mockContract;

  let managementKey;
  let unknownKey;
  let actionKey;

  const neededApprovals = 1;
  let to;
  const value = 0;
  const id = 0;
  const amount = '1000000000000000000';
  const data = utils.hexlify(0);
  let beforeSendBalance;


  let addKeyData;
  let removeKeyData;
  let fromOtherWallet;


  const addActionKey = () => identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
  const isActionKey = () => identity.keyHasPurpose(actionKey, ACTION_KEY);

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet, anotherWallet] = await getWallets(provider);

    managementKey = addressToBytes32(wallet.address);
    unknownKey = addressToBytes32(otherWallet.address);
    actionKey = addressToBytes32(anotherWallet.address);

    identity = await deployContract(wallet, KeyHolder, [managementKey, neededApprovals]);
    fromOtherWallet = await contractWithWallet(identity, otherWallet);
    to = identity.address;
    mockContract = await deployContract(wallet, MockContract);
    beforeSendBalance = await wallet.getBalance();
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
      expect(actualActionKeys[0]).not.to.eq(utils.hexlify(actionKey));
    });

    it('should not allow to remove key without MANAGEMENT_KEY or ACTION_KEY', async () => {
      await addActionKey();
      expect(await isActionKey()).to.be.true;
      await expect(fromOtherWallet.removeKey(actionKey, ACTION_KEY)).to.be.reverted;
    });
  });

  describe('Execute', async () => {
    beforeEach(async () => {
      addKeyData = identity.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
      removeKeyData = identity.interface.functions.removeKey(actionKey, ACTION_KEY).data;
    });

    it('should emit ExecutionRequested event correctly', async () => {
      await expect(identity.execute(to, value, addKeyData)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(id, to, value, addKeyData);
    });

    it('should add executions successfully', async () => {
      const firstNonce = await identity.executionNonce();
      await identity.execute(to, value, addKeyData);
      const actualNonce = await identity.executionNonce();
      expect(firstNonce < actualNonce);
      const execution = await identity.executions(firstNonce);
      expect(execution[0]).to.eq(to);
      expect(execution[1]).to.eq(value);
      expect(execution[2]).to.eq(addKeyData);
    });

    it('should not allow to add execution with unknown key', async () => {
      await expect(fromOtherWallet.addKey(unknownKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });

    describe('On self execute', async () => {
      let to;
      let newActionKey;
      beforeEach(async () => {
        to = identity.address;
        newActionKey = addressToBytes32(fromOtherWallet.address);
      });

      it('Execute addKey on self with management key', async () => {
        await expect(identity.execute(to, value, addKeyData)).to
          .emit(identity, 'ExecutionRequested')
          .withArgs(id, to, value, addKeyData);
      });
      it('Fails execute addKey on self with action key', async () => {
        await identity.addKey(newActionKey, ACTION_KEY, ECDSA_TYPE);
        expect(await identity.keyHasPurpose(newActionKey, ACTION_KEY)).to.be.true;
        await expect(fromOtherWallet.execute(to, value, addKeyData)).to.be.reverted;
      });
      it('Fails execute addKey on self with unknown key', async () => {
        expect(await identity.keyHasPurpose(newActionKey, ACTION_KEY)).to.be.false;
        await expect(fromOtherWallet.execute(to, value, addKeyData)).to.be.reverted;
      });
      it('Execute removeKey on self if with management key', async () => {
        await expect(identity.execute(to, value, removeKeyData)).to
          .emit(identity, 'ExecutionRequested')
          .withArgs(id, to, value, removeKeyData);
      });
      it('Fails execute removeKey on self with action key', async () => {
        await identity.addKey(newActionKey, ACTION_KEY, ECDSA_TYPE);
        expect(await identity.keyHasPurpose(newActionKey, ACTION_KEY)).to.be.true;
        await expect(fromOtherWallet.execute(to, value, removeKeyData)).to.be.reverted;
      });
      it('Fails execute removeKey on self with unknown key', async () => {
        expect(await identity.keyHasPurpose(newActionKey, ACTION_KEY)).to.be.false;
        expect(await identity.keyHasPurpose(newActionKey, MANAGEMENT_KEY)).to.be.false;
        await expect(fromOtherWallet.execute(to, value, removeKeyData)).to.be.reverted;
      });
    });
  });

  describe('Approve with 1 key needed', async () => {
    let to;
    beforeEach(async () => {
      to = identity.address;
      addKeyData = identity.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
    });
    it('should add approval successfully', async () => {
      await identity.execute(to, value, addKeyData);
      await identity.approve(id);
      const approvals = await identity.getExecutionApprovals(id);
      expect(approvals[0]).to.eq(utils.hexlify(managementKey));
    });

    it('should emit Executed event successfully', async () => {
      await identity.execute(to, value, addKeyData);
      await expect(identity.approve(id)).to
        .emit(identity, 'Executed')
        .withArgs(id, to, value, addKeyData);
      expect(await isActionKey()).to.be.true;
    });

    it('should not allow to approve with unknown key', async () => {
      await identity.execute(to, value, addKeyData);
      await expect(fromOtherWallet.approve(id)).to.be.reverted;
    });

    it('should not allow to approve non-existent execution', async () => {
      await expect(identity.approve(id)).to.be.reverted;
    });

    it('Execute transfer', async () => {
      await identity.execute(otherWallet.address, amount, addKeyData);
      await identity.approve(id);
      const afterSend = await wallet.getBalance();
      expect(beforeSendBalance).not.to.eq(afterSend);
    });
  });

  describe('Approve with 2 keys needed', () => {
    const needed2Approvals = 2;
    let identity2Approvals;
    let functionData;
    beforeEach(async () => {
      identity2Approvals = await deployContract(wallet, KeyHolder, [managementKey, needed2Approvals]);
      addKeyData = identity2Approvals.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
      functionData = mockContract.interface.functions.callMe().data;
      fromOtherWallet = await contractWithWallet(identity2Approvals, otherWallet);  
    });
    describe('Two management keys', async () => {
      beforeEach(async () => {
        await identity2Approvals.addKey(addressToBytes32(otherWallet.address), MANAGEMENT_KEY, ECDSA_TYPE);
      });

      it('Execute transfer', async () => {
        await identity2Approvals.execute(otherWallet.address, amount, addKeyData);
        await identity2Approvals.approve(id);
        await fromOtherWallet.approve(id);
        const afterSend = await wallet.getBalance();
        expect(beforeSendBalance).not.to.eq(afterSend);
      });

      it('Execute call on self', async () => {
        const to = identity2Approvals.address;
        await identity2Approvals.execute(to, value, addKeyData);
        await fromOtherWallet.approve(id);
        expect(await identity2Approvals.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
        await identity2Approvals.approve(id);
        expect(await identity2Approvals.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      });

      it('Execute call', async () => {
        const to = mockContract.address;
        await identity2Approvals.execute(to, value, functionData);
        await identity2Approvals.approve(id);
        await fromOtherWallet.approve(id);
        const wasCalled = await mockContract.wasCalled();
        expect(wasCalled).to.be.true;
      });

      it('Will not execute with not enough approvals', async () => {        
        const to = identity2Approvals.address;
        await identity2Approvals.execute(to, value, addKeyData);
        await identity2Approvals.approve(id);
        expect(await isActionKey()).to.be.false;
      });
    });

    describe('One management, one action key', async () => {
      beforeEach(async () => {
        await identity2Approvals.addKey(addressToBytes32(otherWallet.address), ACTION_KEY, ECDSA_TYPE);
      });

      it('Will execute on self with action key approval', async () => {
        const to = identity2Approvals.address;
        await identity2Approvals.execute(to, value, addKeyData);
        await identity2Approvals.approve(id);
        await expect(fromOtherWallet.approve(id)).to
          .emit(identity2Approvals, 'Executed')
          .withArgs(id, to, value, addKeyData);
      });

      it('Execute call', async () => {
        const to = mockContract.address;
        await identity2Approvals.execute(to, value, functionData);
        await identity2Approvals.approve(id);
        await fromOtherWallet.approve(id);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('Will not execute with not enough confirmations', async () => {
        const to = identity2Approvals.address;
        await identity2Approvals.execute(to, value, addKeyData);
        await identity2Approvals.approve(id);
        expect(await isActionKey()).to.be.false;
      });
    });    
  });

  describe('Approve with 0 keys needed', () => {
    const needed0Approvals = 0;
    let identity0Approvals;
    let to;
    let functionData;
    let fromOtherWallet;

    beforeEach(async () => {
      identity0Approvals = await deployContract(wallet, KeyHolder, [managementKey, needed0Approvals]);
      addKeyData = identity0Approvals.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
      to = identity0Approvals.address;
      functionData = mockContract.interface.functions.callMe().data;
      fromOtherWallet = await contractWithWallet(identity0Approvals, otherWallet);
    });

    it('Execute transfer', async () => {
      await identity0Approvals.execute(otherWallet.address, amount, data);
      const afterSend = await wallet.getBalance();
      expect(beforeSendBalance).not.to.eq(afterSend);
    });

    it('Execute call on self', async () => {
      await identity0Approvals.execute(to, value, addKeyData);
      expect(await identity0Approvals.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
    });

    it('Execute call', async () => {
      await identity0Approvals.execute(mockContract.address, value, functionData);
      expect(await mockContract.wasCalled()).to.be.true;
    });

    it('Will not execute with unknown key', async () => {
      await expect(fromOtherWallet.execute(mockContract.address, value, functionData)).to.be.reverted;
    });

    it('Will not execute on self with unknow key', async () => {
      await expect(fromOtherWallet.execute(to, value, addKeyData)).to.be.reverted;
    });

    it('Will not execute on self with action key', async () => {
      await identity0Approvals.addKey(addressToBytes32(otherWallet.address), ACTION_KEY, ECDSA_TYPE);
      await expect(fromOtherWallet.execute(to, value, addKeyData)).to.be.reverted;
    });
  });

  describe('Do execute', async () => {
    let to;
    let functionData;
    beforeEach(async () => {
      functionData = mockContract.interface.functions.callMe().data;
      to = mockContract.address;
    });

    it('success call function', async () => {
      await identity.execute(to, value, functionData);
      await identity.approve(id);
      const wasCalled = await mockContract.wasCalled();
      expect(wasCalled).to.be.true;
    });

    it('Should emit Executed event', async () => {
      await identity.execute(to, value, functionData);
      await expect(identity.approve(id)).to
        .emit(identity, 'Executed')
        .withArgs(id, to, value, functionData);
    });
    
    it('emit ExecutionFailed', async () => {
      await identity.execute(to, amount, functionData);
      await expect(identity.approve(id)).to
        .emit(identity, 'ExecutionFailed')
        .withArgs(id, to, amount, functionData);
    });
  });
});
