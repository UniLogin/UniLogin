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

describe.only('Contract - yarn test -Identity', async () => {
  let provider;
  let wallet;
  let targetWallet;
  let anotherWallet;
  let secondWallet;
  let thirdWallet;
  let fourthWallet;

  let identity;
  let mockContract;
  let managementWallet;
  let unknownWallet;
  let actionWallet;

  let managementWalletKey;
  let unknownWalletKey;

  let managementKey;
  let actionKey;
  let actionWalletKey;

  let to;
  const value = 0;
  const id = 0;
  const amount = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  let targetBalance;
  const required0Approvals = 0;
  const required2Approvals = 2;

  let addKeyData;
  let removeKeyData;

  const addActionKey = () => identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
  const isActionKey = () => identity.keyHasPurpose(actionKey, ACTION_KEY);

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, secondWallet, thirdWallet, fourthWallet, anotherWallet, targetWallet] = await getWallets(provider);

    managementKey = addressToBytes32(wallet.address);
    managementWalletKey = addressToBytes32(secondWallet.address);
    actionWalletKey = addressToBytes32(thirdWallet.address);
    unknownWalletKey = addressToBytes32(fourthWallet.address);
    actionKey = addressToBytes32(anotherWallet.address);

    identity = await deployContract(wallet, KeyHolder, [managementKey]);
    mockContract = await deployContract(wallet, MockContract);

    managementWallet = await contractWithWallet(identity, secondWallet);
    actionWallet = await contractWithWallet(identity, thirdWallet);
    unknownWallet = await contractWithWallet(identity, fourthWallet);

    to = identity.address;
    targetBalance = await targetWallet.getBalance();

    await identity.addKey(managementWalletKey, MANAGEMENT_KEY, ECDSA_TYPE);
    await identity.addKey(actionWalletKey, ACTION_KEY, ECDSA_TYPE);

    addKeyData = identity.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
    removeKeyData = identity.interface.functions.removeKey(actionKey, ACTION_KEY).data;
    await wallet.send(identity.address, amount);
  });

  describe('Create', async () => {
    it('Should be deployed successfully', async () => {
      const {address} = identity;
      expect(address).to.not.be.null;
    });

    it('Key should be management key', async () => {
      const key = await identity.getKey(managementKey);
      expect(key.purpose).to.eq(MANAGEMENT_KEY);
    });

    it('Should return the purpose', async () => {
      expect(await identity.keyHasPurpose(managementKey, MANAGEMENT_KEY)).to.be.true;
      expect(await identity.keyHasPurpose(managementKey, ACTION_KEY)).to.be.false;
      expect(await identity.keyHasPurpose(managementWalletKey, MANAGEMENT_KEY)).to.be.true;
      expect(await identity.keyHasPurpose(actionKey, MANAGEMENT_KEY)).to.be.false;
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
      expect(await identity.keyHasPurpose(actionWalletKey, ACTION_KEY)).to.be.true;
    });

    it('Should not allow to set required approvals greater than management keys nonce', async () => {
      const required3Approvals = 3;
      const managementKeysNonce = await identity.getKeysByPurpose(MANAGEMENT_KEY);
      expect(managementKeysNonce.length).to.lt(required3Approvals);
      await expect(identity.setRequiredApprovals(required3Approvals)).to.be.reverted;
    });
  });

  describe('Add key', async () => {
    it('Should add key successfully', async () => {
      await addActionKey();
      expect(await isActionKey()).to.be.true;
      const existingKeys = await identity.keys(actionKey);
      expect(existingKeys[0]).to.eq(ACTION_KEY);
      expect(existingKeys[1]).to.eq(ECDSA_TYPE);
      expect(existingKeys[2]).to.eq(utils.hexlify(actionKey));
    });

    it('Should not allow to add existing key', async () => {
      await expect(identity.addKey(managementKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });

    it('Should emit KeyAdded event successfully', async () => {
      await expect(addActionKey()).to
        .emit(identity, 'KeyAdded')
        .withArgs(utils.hexlify(actionKey), ACTION_KEY, ECDSA_TYPE);
    });

    it('Should not allow to add new key with unknown key', async () => {
      await expect(unknownWallet.addKey(unknownWalletKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });

    it('Should allow to add key by execute', async () => {
      await identity.execute(to, value, addKeyData);
      await identity.approve(id);
      expect(await isActionKey()).to.be.true;
    });

    it('Should not allow to add key with action key', async () => {
      await expect(actionWallet.addKey(unknownWalletKey, MANAGEMENT_KEY, ECDSA_TYPE)).to.be.reverted;
    });
  });

  describe('Get key', async () => {
    it('Should return key correctly', async () => {
      await addActionKey();
      const getKeyResult = await identity.getKey(actionKey);
      expect(getKeyResult[0]).to.eq(ACTION_KEY);
      expect(getKeyResult[2]).to.eq(utils.hexlify(actionKey));
    });

    it('Should return key purpose correctly', async () => {
      expect(await identity.getKeyPurpose(managementKey)).to.eq(MANAGEMENT_KEY);
      await addActionKey();
      expect(await identity.getKeyPurpose(actionKey)).to.eq(ACTION_KEY);
    });

    it('Should return keys by purpose correctly', async () => {
      const actualManagementKeys = await identity.getKeysByPurpose(MANAGEMENT_KEY);
      expect(actualManagementKeys[0]).to.eq(utils.hexlify(managementKey));
      await identity.addKey(actionKey, ACTION_KEY, ECDSA_TYPE);
      const actualActionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(actualActionKeys[1]).to.eq(utils.hexlify(actionKey));
    });
  });

  describe('Remove key', async () => {
    beforeEach(async () => {
      await addActionKey();
    });
    it('Should remove key successfully', async () => {
      expect(await isActionKey()).to.be.true;
      await identity.removeKey(actionKey, ACTION_KEY);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
    });

    it('Should emit KeyRemoved event successfully', async () => {
      expect(await isActionKey()).to.be.true;
      await expect(identity.removeKey(actionKey, ACTION_KEY)).to
        .emit(identity, 'KeyRemoved')
        .withArgs(utils.hexlify(actionKey), ACTION_KEY, ECDSA_TYPE);
    });

    it('Should remove key from keysByPurpose', async () => {
      const actionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(actionKeys[1]).to.eq(utils.hexlify(actionKey));
      expect(await isActionKey()).to.be.true;
      await identity.removeKey(actionKey, ACTION_KEY);
      expect(await isActionKey()).to.be.false;
      const actualActionKeys = await identity.getKeysByPurpose(ACTION_KEY);
      expect(actualActionKeys[1]).not.to.eq(utils.hexlify(actionKey));
    });

    it('Should not allow to remove key with unknown key', async () => {
      expect(await isActionKey()).to.be.true;
      await expect(unknownWallet.removeKey(actionKey, ACTION_KEY)).to.be.reverted;
    });

    it('Should not allow to remove key with action key', async () => {
      await expect(actionWallet.removeKey(actionKey, ACTION_KEY)).to.be.reverted;
    });

    it('Should not allow to remove last management key', async () => {
      await identity.removeKey(managementWalletKey, MANAGEMENT_KEY);
      expect(await identity.keyHasPurpose(managementWalletKey, MANAGEMENT_KEY)).to.be.false;
      await expect(identity.removeKey(managementKey, MANAGEMENT_KEY)).to.be.reverted;
    });

    it('Should not allow to remove management key, when their amount equals reguired approvals', async () => {
      await identity.setRequiredApprovals(required2Approvals);
      await expect(identity.removeKey(managementWalletKey, MANAGEMENT_KEY)).to.be.reverted;
    });

    it('Should allow to remove key by execute', async () => {
      await identity.execute(to, value, removeKeyData);
      await identity.approve(id);
      expect(await isActionKey()).to.be.false;
    });
  });

  describe('Execute', async () => {
    let functionData;
    let toMock;
    beforeEach(async () => {
      functionData = mockContract.interface.functions.callMe().data;
      toMock = mockContract.address;
    });

    it('Should emit ExecutionRequested event correctly', async () => {
      await expect(identity.execute(toMock, value, functionData)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(id, toMock, value, functionData);
    });

    it('Should add executions successfully', async () => {
      const firstNonce = await identity.executionNonce();
      await identity.execute(toMock, value, functionData);
      const actualNonce = await identity.executionNonce();
      expect(firstNonce).not.to.eq(actualNonce);
      const execution = await identity.executions(firstNonce);
      expect(execution[0]).to.eq(toMock);
      expect(execution[1]).to.eq(value);
      expect(execution[2]).to.eq(functionData);
    });

    it('Should not allow to add execution with unknown key', async () => {
      await expect(unknownWallet.execute(toMock, value, functionData)).to.be.reverted;
    });

    it('Should allow to add execution with action key', async () => {
      await expect(actionWallet.execute(toMock, value, functionData)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(id, toMock, value, functionData);
    });

    it('Can not execute twice even when requiredConfirmation increased', async () => {
      await identity.execute(targetWallet.address, amount, data);
      expect(await targetWallet.getBalance()).to.be.eq(targetBalance);

      await identity.approve(id);
      const afterFirstApproveTargetBalance = await targetWallet.getBalance();
      expect(afterFirstApproveTargetBalance).not.to.eq(targetBalance);

      await managementWallet.approve(id);
      const afterSecondApproveTargetBalance = await targetWallet.getBalance();
      expect(afterSecondApproveTargetBalance).to.eq(afterFirstApproveTargetBalance);
    }); 

    describe('On self execute', async () => {
      it('Execute addKey on self with management key', async () => {
        await expect(identity.execute(to, value, addKeyData)).to
          .emit(identity, 'ExecutionRequested')
          .withArgs(id, to, value, addKeyData);
      });

      it('Fails execute addKey on self with action key', async () => {
        await expect(actionWallet.execute(to, value, addKeyData)).to.be.reverted;
      });

      it('Fails execute addKey on self with unknown key', async () => {
        await expect(unknownWallet.execute(to, value, addKeyData)).to.be.reverted;
      });

      it('Execute removeKey on self if with management key', async () => {
        await expect(identity.execute(to, value, removeKeyData)).to
          .emit(identity, 'ExecutionRequested')
          .withArgs(id, to, value, removeKeyData);
      });

      it('Fails execute removeKey on self with action key', async () => {
        await expect(actionWallet.execute(to, value, removeKeyData)).to.be.reverted;
      });

      it('Fails execute removeKey on self with unknown key', async () => {
        await expect(unknownWallet.execute(to, value, removeKeyData)).to.be.reverted;
      });
    });
  });

  describe('Approve with 0 keys needed', () => {
    let functionData;
    beforeEach(async () => {
      functionData = mockContract.interface.functions.callMe().data;
      await identity.setRequiredApprovals(required0Approvals);
    });

    it('Execute transfer', async () => {
      await identity.execute(targetWallet.address, amount, data);
      const targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
    });

    it('Execute call on self', async () => {
      await identity.execute(to, value, addKeyData);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
    });

    it('Execute call', async () => {
      await identity.execute(mockContract.address, value, functionData);
      expect(await mockContract.wasCalled()).to.be.true;
    });

    it('Will not execute with unknown key', async () => {
      await expect(unknownWallet.execute(mockContract.address, value, functionData)).to.be.reverted;
    });

    it('Will not execute on self with unknow key', async () => {
      await expect(unknownWallet.execute(to, value, addKeyData)).to.be.reverted;
    });

    it('Will not execute on self with action key', async () => {
      await expect(actionWallet.execute(to, value, addKeyData)).to.be.reverted;
    });
  });

  describe('Approve with 1 key needed', async () => {
    it('Should add approval successfully', async () => {
      await identity.execute(to, value, addKeyData);
      await identity.approve(id);
      const approvals = await identity.getExecutionApprovals(id);
      expect(approvals[0]).to.eq(utils.hexlify(managementKey));
    });

    it('Should emit Executed event successfully', async () => {
      await identity.execute(to, value, addKeyData);
      await expect(identity.approve(id)).to
        .emit(identity, 'Executed')
        .withArgs(id, to, value, addKeyData);
      expect(await isActionKey()).to.be.true;
    });

    it('Should not allow to approve with unknown key', async () => {
      await identity.execute(to, value, addKeyData);
      await expect(unknownWallet.approve(id)).to.be.reverted;
    });

    it('Should not allow to approve on self with action key', async () => {
      await identity.execute(to, value, addKeyData);
      await expect(actionWallet.approve(id)).to.be.reverted;
    });

    it('Should not allow to approve non-existent execution', async () => {
      await expect(identity.approve(id)).to.be.reverted;
    });

    it('Execute transfer', async () => {
      await identity.execute(targetWallet.address, amount, data);
      await identity.approve(id);      
      const targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).not.to.eq(targetBalance);
      expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
    });
  });

  describe('Approve with 2 keys needed', () => {
    let functionData;
    const addKeyExecutionId = 0;
    const callMockExecutionId = 1;
    beforeEach(async () => {
      functionData = mockContract.interface.functions.callMe().data;
      await identity.execute(to, value, addKeyData);
      await identity.execute(mockContract.address, value, functionData);
      await identity.setRequiredApprovals(required2Approvals);
    });

    it('Will not approve with used key', async () => {
      await identity.approve(addKeyExecutionId);
      await expect(identity.approve(addKeyExecutionId)).to.be.reverted;
    });

    describe('Two management keys', async () => {
      it('Execute transfer', async () => {
        const id = 2;
        await identity.execute(targetWallet.address, amount, data);
        await identity.approve(id);
        await managementWallet.approve(id);
        const targetBalanceAfterSend = await targetWallet.getBalance();
        expect(targetBalanceAfterSend).not.to.eq(targetBalance);
        expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
      });

      it('Execute call on self', async () => {
        await managementWallet.approve(addKeyExecutionId);
        expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.false;
        await identity.approve(addKeyExecutionId);
        expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
      });

      it('Execute call', async () => {
        await identity.approve(callMockExecutionId);
        await managementWallet.approve(callMockExecutionId);
        const wasCalled = await mockContract.wasCalled();
        expect(wasCalled).to.be.true;
      });

      it('Will not execute with not enough approvals', async () => { 
        await identity.approve(addKeyExecutionId);
        expect(await isActionKey()).to.be.false;
      });
    });

    describe('One management, one action key', async () => {
      it('Will not execute on self with action key approval', async () => {
        await identity.approve(addKeyExecutionId);
        await expect(actionWallet.approve(addKeyExecutionId)).to.be.reverted;
      });

      it('Execute call', async () => {
        await identity.approve(callMockExecutionId);
        await actionWallet.approve(callMockExecutionId);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('Will not execute with not enough confirmations', async () => {
        await identity.approve(addKeyExecutionId);
        expect(await isActionKey()).to.be.false;
      });

      it('Execute transfer', async () => {
        const id = 2;
        await identity.execute(targetWallet.address, amount, data);
        await identity.approve(id);
        await actionWallet.approve(id);
        expect(await targetWallet.getBalance()).not.to.eq(targetBalance);
      });
    });  
  });

  describe('Do execute', async () => {
    let functionData;
    beforeEach(async () => {
      functionData = mockContract.interface.functions.callMe().data;
      to = mockContract.address;
    });

    it('Success call function', async () => {
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
    
    it('Should emit ExecutionFailed', async () => {
      await identity.execute(to, amount, functionData);
      await expect(identity.approve(id)).to
        .emit(identity, 'ExecutionFailed')
        .withArgs(id, to, amount, functionData);
    });
  });
});
