import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../../build/KeyHolder';
import MockContract from '../../build/MockContract';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import {addressToBytes32} from '../../lib/utils/utils';
import {messageSignature} from '../../lib/utils/tools';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../lib/sdk/sdk';

chai.use(chaiAsPromised);
chai.use(solidity);

const {expect} = chai;

describe.only('Key holder: approvals', async () => {
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

  let managementKey;
  let actionKey;
  let actionWalletKey;
  let functionData;
  let signature;
  let to;
  let toMock;
  let toTarget;
  const value = 0;
  const id = 0;
  const amount = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  let targetBalance;
  let targetBalanceAfterSend;
  const required0Approvals = 0;
  const required2Approvals = 2;

  let addKeyData;

  const isActionKey = () => identity.keyHasPurpose(actionKey, ACTION_KEY);

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, secondWallet, thirdWallet, fourthWallet, anotherWallet, targetWallet] = await getWallets(provider);

    managementKey = addressToBytes32(wallet.address);
    managementWalletKey = addressToBytes32(secondWallet.address);
    actionWalletKey = addressToBytes32(thirdWallet.address);
    actionKey = addressToBytes32(anotherWallet.address);

    identity = await deployContract(wallet, KeyHolder, [managementKey]);
    mockContract = await deployContract(wallet, MockContract);

    managementWallet = await contractWithWallet(identity, secondWallet);
    actionWallet = await contractWithWallet(identity, thirdWallet);
    unknownWallet = await contractWithWallet(identity, fourthWallet);

    to = identity.address;
    toMock = mockContract.address;
    toTarget = targetWallet.address;

    targetBalance = await targetWallet.getBalance();

    await identity.addKey(managementWalletKey, MANAGEMENT_KEY, ECDSA_TYPE);
    await identity.addKey(actionWalletKey, ACTION_KEY, ECDSA_TYPE);

    addKeyData = identity.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
    functionData = mockContract.interface.functions.callMe().data;
    await wallet.send(identity.address, amount);
  });
  describe('Approve with 0 keys needed', () => {
    beforeEach(async () => {
      await identity.setRequiredApprovals(required0Approvals);
    });
    
    it('Execute transfer', async () => {
      await identity.execute(toTarget, amount, data);
      const targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
    });
    
    it('Execute call on self', async () => {
      await identity.execute(to, value, addKeyData);
      expect(await identity.keyHasPurpose(actionKey, ACTION_KEY)).to.be.true;
    });
    
    it('Execute call', async () => {
      await identity.execute(toMock, value, functionData);
      expect(await mockContract.wasCalled()).to.be.true;
    });
    
    it('Will not execute with unknown key', async () => {
      await expect(unknownWallet.execute(toMock, value, functionData)).to.be.reverted;
    });
    
    it('Will not execute on self with unknown key', async () => {
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
      await identity.execute(toTarget, amount, data);
      await identity.approve(id);      
      targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).not.to.eq(targetBalance);
      expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
    });
  });

  describe('Approve with 2 keys needed', () => {
    const addKeyExecutionId = 0;
    const callMockExecutionId = 1;
    beforeEach(async () => {
      await identity.execute(to, value, addKeyData);
      await identity.execute(toMock, value, functionData);
      await identity.setRequiredApprovals(required2Approvals);
    });

    it('Will not approve with used key', async () => {
      await identity.approve(addKeyExecutionId);
      await expect(identity.approve(addKeyExecutionId)).to.be.reverted;
    });

    describe('Two management keys', async () => {
      it('Execute transfer', async () => {
        const id = 2;
        await identity.execute(toTarget, amount, data);
        await identity.approve(id);
        await managementWallet.approve(id);
        targetBalanceAfterSend = await targetWallet.getBalance();
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
        await identity.execute(toTarget, amount, data);
        await identity.approve(id);
        await actionWallet.approve(id);
        expect(await targetWallet.getBalance()).not.to.eq(targetBalance);
      });
    });  
  });

  describe('Approve signed', async () => {
    it('Execute transfer', async () => {
      signature = messageSignature(wallet, toTarget, amount, data); 
      await identity.executeSigned(toTarget, amount, data, signature);
      expect(await targetWallet.getBalance()).to.eq(targetBalance);
      await identity.approveSigned(id, signature);
      targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).not.to.eq(targetBalance);
    });

    it('Execute call on self', async () => {
      signature = messageSignature(wallet, identity.address, value, addKeyData);
      await identity.executeSigned(identity.address, value, addKeyData, signature);
      await identity.approveSigned(id, signature);
      expect(await isActionKey()).to.be.true;
    });
    it('Execute call', async () => {
      signature = messageSignature(wallet, toMock, value, functionData);
      await identity.executeSigned(toMock, value, functionData, signature);
      await identity.approveSigned(id, signature);
      expect(await mockContract.wasCalled()).to.be.true;
    });
    xit('Should allow to approve with action key');
    xit('Should not allow to approve with unknown key');
    xit('Should not allow to approve on self with unknown key');
    xit('Should not allow to approve on self with action key');
  });
});
