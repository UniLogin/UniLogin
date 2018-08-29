import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../../../build/KeyHolder';
import MockContract from '../../../build/MockContract';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import {addressToBytes32, messageSignature, messageSignatureForApprovals} from '../../../lib/utils/utils';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../../lib/sdk/sdk';

chai.use(chaiAsPromised);
chai.use(solidity);

const {expect} = chai;

describe('Key holder: approvals', async () => {
  let provider;
  let wallet;
  let targetWallet;
  let anotherWallet;

  let identity;
  let mockContract;
  let managementWallet;
  let unknownWallet;
  let actionWallet;

  let fromManagementWallet;
  let fromActionWallet;
  let fromUnknownWallet;

  let managementWalletKey;

  let managementKey;
  let actionKey;
  let actionWalletKey;
  let functionData;
  let signature;
  let signatureForApprovals;
  let mockContractAddress;
  let targetAddress;
  const amount = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  let targetBalance;
  let targetBalanceAfterSend;
  let addKeyData;

  const isActionKey = () => identity.keyHasPurpose(actionKey, ACTION_KEY);

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, managementWallet, actionWallet, unknownWallet, anotherWallet, targetWallet] = await getWallets(provider);

    managementKey = addressToBytes32(wallet.address);
    managementWalletKey = addressToBytes32(managementWallet.address);
    actionWalletKey = addressToBytes32(actionWallet.address);
    actionKey = addressToBytes32(anotherWallet.address);

    identity = await deployContract(wallet, KeyHolder, [managementKey]);
    mockContract = await deployContract(wallet, MockContract);

    fromManagementWallet = await contractWithWallet(identity, managementWallet);
    fromActionWallet = await contractWithWallet(identity, actionWallet);
    fromUnknownWallet = await contractWithWallet(identity, unknownWallet);

    mockContractAddress = mockContract.address;
    targetAddress = targetWallet.address;

    targetBalance = await targetWallet.getBalance();

    await identity.addKey(managementWalletKey, MANAGEMENT_KEY, ECDSA_TYPE);
    await identity.addKey(actionWalletKey, ACTION_KEY, ECDSA_TYPE);

    addKeyData = identity.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
    functionData = mockContract.interface.functions.callMe().data;
    await wallet.send(identity.address, amount);
  });

  describe('Approve with 0 keys needed', () => {
    it('Execute transfer', async () => {
      await identity.execute(targetAddress, amount, data);
      const targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
    });

    it('Execute call on self', async () => {
      await identity.execute(identity.address, 0, addKeyData);
      expect(await isActionKey()).to.be.true;
    });

    it('Execute call', async () => {
      await identity.execute(mockContractAddress, 0, functionData);
      expect(await mockContract.wasCalled()).to.be.true;
    });

    it('Will not execute with unknown key', async () => {
      await expect(fromUnknownWallet.execute(mockContractAddress, 0, functionData)).to.be.reverted;
    });

    it('Will not execute on self with unknown key', async () => {
      await expect(fromUnknownWallet.execute(identity.address, 0, addKeyData)).to.be.reverted;
    });

    it('Will not execute on self with action key', async () => {
      await expect(fromActionWallet.execute(identity.address, 0, addKeyData)).to.be.reverted;
    });
  });

  describe('Approve with 1 key needed', async () => {
    beforeEach(async () => {
      await identity.setRequiredApprovals(1);
    });
    it('Should add approval successfully', async () => {
      await identity.execute(identity.address, 0, addKeyData);
      await identity.approve(0);
      const approvals = await identity.getExecutionApprovals(0);
      expect(approvals[0]).to.eq(utils.hexlify(managementKey));
    });

    it('Should emit Executed event successfully', async () => {
      await identity.execute(identity.address, 0, addKeyData);
      await expect(identity.approve(0)).to
        .emit(identity, 'Executed')
        .withArgs(0, identity.address, 0, addKeyData);
      expect(await isActionKey()).to.be.true;
    });

    it('Should not allow to approve with unknown key', async () => {
      await identity.execute(identity.address, 0, addKeyData);
      await expect(fromUnknownWallet.approve(0)).to.be.reverted;
    });

    it('Should not allow to approve on self with action key', async () => {
      await identity.execute(identity.address, 0, addKeyData);
      await expect(fromActionWallet.approve(0)).to.be.reverted;
    });

    it('Should not allow to approve non-existent execution', async () => {
      await expect(identity.approve(0)).to.be.reverted;
    });

    it('Execute transfer', async () => {
      await identity.execute(targetAddress, amount, data);
      await identity.approve(0);
      targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).not.to.eq(targetBalance);
      expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
    });
    
    it('Can not execute twice even when requiredConfirmation increased', async () => {
      await identity.execute(targetAddress, amount, data);
      expect(await targetWallet.getBalance()).to.be.eq(targetBalance);

      await identity.approve(0);
      const afterFirstApproveTargetBalance = await targetWallet.getBalance();
      expect(afterFirstApproveTargetBalance).not.to.eq(targetBalance);

      await fromManagementWallet.approve(0);
      const afterSecondApproveTargetBalance = await targetWallet.getBalance();
      expect(afterSecondApproveTargetBalance).to.eq(afterFirstApproveTargetBalance);
    });
  });

  describe('Approve with 2 keys needed', () => {
    beforeEach(async () => {
      await identity.setRequiredApprovals(2);
      await identity.execute(identity.address, 0, addKeyData);
      await identity.execute(mockContractAddress, 0, functionData);
    });

    it('Will not approve with used key', async () => {
      await identity.approve(0);
      await expect(identity.approve(0)).to.be.reverted;
    });

    describe('Two management keys', async () => {
      it('Execute transfer', async () => {
        await identity.execute(targetAddress, amount, data);
        await identity.approve(2);
        await fromManagementWallet.approve(2);
        targetBalanceAfterSend = await targetWallet.getBalance();
        expect(targetBalanceAfterSend).not.to.eq(targetBalance);
        expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
      });

      it('Execute call on self', async () => {
        await fromManagementWallet.approve(0);
        expect(await isActionKey()).to.be.false;
        await identity.approve(0);
        expect(await isActionKey()).to.be.true;
      });

      it('Execute call', async () => {
        await identity.approve(1);
        await fromManagementWallet.approve(1);
        const wasCalled = await mockContract.wasCalled();
        expect(wasCalled).to.be.true;
      });

      it('Will not execute with not enough approvals', async () => {
        await identity.approve(0);
        expect(await isActionKey()).to.be.false;
      });
    });

    describe('One management, one action key', async () => {
      it('Will not execute on self with action key approval', async () => {
        await identity.approve(0);
        await expect(fromActionWallet.approve(0)).to.be.reverted;
      });

      it('Execute call', async () => {
        await identity.approve(1);
        await fromActionWallet.approve(1);
        expect(await mockContract.wasCalled()).to.be.true;
      });

      it('Will not execute with not enough confirmations', async () => {
        await identity.approve(0);
        expect(await isActionKey()).to.be.false;
      });

      it('Execute transfer', async () => {
        await identity.execute(targetAddress, amount, data);
        await identity.approve(2);
        await fromActionWallet.approve(2);
        expect(await targetWallet.getBalance()).not.to.eq(targetBalance);
      });
    });
  });

  describe('Approve signed with 0 keys needed', async () => {
    it('Execute transfer', async () => {
      signature = messageSignature(wallet, targetAddress, amount, data);
      await identity.executeSigned(targetAddress, amount, data, signature);
      const targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
    });

    it('Execute call on self', async () => {
      signature = messageSignature(wallet, identity.address, 0, addKeyData);
      await identity.executeSigned(identity.address, 0, addKeyData, signature);
      expect(await isActionKey()).to.be.true;
    });

    it('Execute call', async () => {
      signature = messageSignature(wallet, mockContractAddress, 0, functionData);
      await identity.executeSigned(mockContractAddress, 0, functionData, signature);
      expect(await mockContract.wasCalled()).to.be.true;
    });

    it('Will not execute with unknown key', async () => {
      signature = messageSignature(unknownWallet, mockContractAddress, 0, functionData);
      await expect(fromUnknownWallet.executeSigned(mockContractAddress, 0, functionData, signature)).to.be.reverted;
    });

    it('Will not execute on self with unknown key', async () => {
      signature = messageSignature(unknownWallet, mockContractAddress, 0, functionData);
      await expect(fromUnknownWallet.executeSigned(identity.address, 0, addKeyData, signature)).to.be.reverted;
    });

    it('Will not execute on self with action key', async () => {
      signature = messageSignature(actionWallet, identity.address, 0, addKeyData);
      await expect(fromActionWallet.executeSigned(identity.address, 0, addKeyData, signature)).to.be.reverted;
    });

    it('Will execute call with action key', async () => {
      signature = messageSignature(actionWallet, mockContractAddress, 0, functionData);
      await fromActionWallet.executeSigned(mockContractAddress, 0, functionData, signature);
      expect(await mockContract.wasCalled()).to.be.true;
    });
  });

  describe('Approve signed with 1 key needed', async () => {
    beforeEach(async () => {
      await identity.setRequiredApprovals(1);
      signature = messageSignature(wallet, mockContractAddress, 0, functionData);
      await identity.executeSigned(mockContractAddress, 0, functionData, signature);
    });

    it('Execute transfer', async () => {
      signature = messageSignature(wallet, targetAddress, amount, data);
      await identity.executeSigned(targetAddress, amount, data, signature);
      expect(await targetWallet.getBalance()).to.eq(targetBalance);
      signatureForApprovals = messageSignatureForApprovals(wallet, 1);
      await identity.approveSigned(1, signatureForApprovals);
      targetBalanceAfterSend = await targetWallet.getBalance();
      expect(targetBalanceAfterSend).not.to.eq(targetBalance);
    });

    it('Execute call', async () => {
      signatureForApprovals = messageSignatureForApprovals(wallet, 0);
      await identity.approveSigned(0, signatureForApprovals);
      expect(await mockContract.wasCalled()).to.be.true;
    });

    it('Should allow to approve with action key', async () => {
      signatureForApprovals = messageSignatureForApprovals(actionWallet, 0);
      await fromActionWallet.approveSigned(0, signatureForApprovals);
      expect(await mockContract.wasCalled()).to.be.true;
    });

    it('Should not allow to approve with unknown key', async () => {
      signatureForApprovals = messageSignatureForApprovals(unknownWallet, 0);
      await expect(fromUnknownWallet.approveSigned(0, signatureForApprovals)).to.be.reverted;
    });

    describe('On self', async () => {
      beforeEach(async () => {
        signature = messageSignature(wallet, identity.address, 0, addKeyData);
        await identity.executeSigned(identity.address, 0, addKeyData, signature);
      });

      it('Execute call on self', async () => {
        signatureForApprovals = messageSignatureForApprovals(wallet, 1);
        await identity.approveSigned(1, signatureForApprovals);
        expect(await isActionKey()).to.be.true;
      });

      it('Should not allow to approve on self with action key', async () => {
        signatureForApprovals = messageSignatureForApprovals(actionWallet, 1);
        await expect(fromActionWallet.approveSigned(1, signatureForApprovals)).to.be.reverted;
      });

      it('Should not allow to approve on self with unknown key', async () => {
        signatureForApprovals = messageSignatureForApprovals(unknownWallet, 1);
        await expect(fromUnknownWallet.approveSigned(1, signatureForApprovals)).to.be.reverted;
      });
    });
  });

  describe('Approve signed with 2 keys needed', async () => {
    beforeEach(async () => {
      await identity.setRequiredApprovals(2);

      await identity.executeSigned(targetAddress, amount, data, messageSignature(wallet, targetAddress, amount, data));
      await identity.executeSigned(identity.address, 0, addKeyData, messageSignature(wallet, identity.address, 0, addKeyData));
      await identity.executeSigned(mockContractAddress, 0, functionData, messageSignature(wallet, mockContractAddress, 0, functionData));

      await identity.approveSigned(0, messageSignatureForApprovals(wallet, 0));
      await identity.approveSigned(1, messageSignatureForApprovals(wallet, 1));
      await identity.approveSigned(2, messageSignatureForApprovals(wallet, 2));
    });

    it('Will not approve with used key', async () => {
      await expect(identity.approveSigned(0, messageSignatureForApprovals(wallet, 0))).to.be.reverted;
      await expect(identity.approveSigned(1, messageSignatureForApprovals(wallet, 1))).to.be.reverted;
      await expect(identity.approveSigned(2, messageSignatureForApprovals(wallet, 2))).to.be.reverted;
    });

    describe('Two management keys', async () => {
      it('Execute transfer', async () => {
        await fromManagementWallet.approveSigned(0, messageSignatureForApprovals(managementWallet, 0));
        targetBalanceAfterSend = await targetWallet.getBalance();
        expect(targetBalanceAfterSend).not.to.eq(targetBalance);
      });

      it('Execute call on self', async () => {
        expect(await isActionKey()).to.be.false;
        await fromManagementWallet.approveSigned(1, messageSignatureForApprovals(managementWallet, 1));
        expect(await isActionKey()).to.be.true;
      });

      it('Execute call', async () => {
        await fromManagementWallet.approveSigned(2, messageSignatureForApprovals(managementWallet, 2));
        expect(await mockContract.wasCalled()).to.be.true;
      });
    });

    describe('One management, one action key', async () => {
      it('Execute transfer', async () => {
        await fromActionWallet.approveSigned(0, messageSignatureForApprovals(actionWallet, 0));
        targetBalanceAfterSend = await targetWallet.getBalance();
        expect(targetBalanceAfterSend).not.to.eq(targetBalance);
      });

      it('Will not execute on self with action key approval', async () => {
        await expect(fromActionWallet.approveSigned(1, messageSignatureForApprovals(actionWallet, 1))).to.be.reverted;
      });

      it('Execute call', async () => {
        await fromActionWallet.approveSigned(2, messageSignatureForApprovals(actionWallet, 2));
        expect(await mockContract.wasCalled()).to.be.true;
      });
    });
  });
});
