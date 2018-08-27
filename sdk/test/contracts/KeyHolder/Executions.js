import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../../../build/KeyHolder';
import MockContract from '../../../build/MockContract';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import {addressToBytes32, messageSignature} from '../../../lib/utils/utils';
import {utils, Wallet} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../../lib/sdk/sdk';


chai.use(chaiAsPromised);
chai.use(solidity);

const {expect} = chai;

describe('Key holder: executions', async () => {
  let provider;
  let wallet;
  let targetWallet;
  let anotherWallet;
  let managementWallet;
  let actionWallet;
  let unknownWallet;

  let identity;
  let mockContract;
  let fromManagementWallet;
  let fromUnknownWallet;
  let fromActionWallet;

  let managementWalletKey;

  let managementKey;
  let actionKey;
  let actionWalletKey;
  let functionData;

  let to;
  let toMock;
  let toTarget;
  const value = 0;
  const id = 0;
  const amount = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  let targetBalance;

  let addKeyData;
  let removeKeyData;

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

    to = identity.address;
    toMock = mockContract.address;
    toTarget = targetWallet.address;

    targetBalance = await targetWallet.getBalance();

    await identity.addKey(managementWalletKey, MANAGEMENT_KEY, ECDSA_TYPE);
    await identity.addKey(actionWalletKey, ACTION_KEY, ECDSA_TYPE);

    addKeyData = identity.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
    removeKeyData = identity.interface.functions.removeKey(actionKey, ACTION_KEY).data;
    functionData = mockContract.interface.functions.callMe().data;
    await wallet.send(identity.address, amount);
  });

  describe('Execute', async () => {
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
      await expect(fromUnknownWallet.execute(toMock, value, functionData)).to.be.reverted;
    });

    it('Should allow to add execution with action key', async () => {
      await expect(fromActionWallet.execute(toMock, value, functionData)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(id, toMock, value, functionData);
    });

    it('Can not execute twice even when requiredConfirmation increased', async () => {
      await identity.execute(toTarget, amount, data);
      expect(await targetWallet.getBalance()).to.be.eq(targetBalance);

      await identity.approve(id);
      const afterFirstApproveTargetBalance = await targetWallet.getBalance();
      expect(afterFirstApproveTargetBalance).not.to.eq(targetBalance);

      await fromManagementWallet.approve(id);
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
        await expect(fromActionWallet.execute(to, value, addKeyData)).to.be.reverted;
      });

      it('Fails execute addKey on self with unknown key', async () => {
        await expect(fromUnknownWallet.execute(to, value, addKeyData)).to.be.reverted;
      });

      it('Execute removeKey on self if with management key', async () => {
        await expect(identity.execute(to, value, removeKeyData)).to
          .emit(identity, 'ExecutionRequested')
          .withArgs(id, to, value, removeKeyData);
      });

      it('Fails execute removeKey on self with action key', async () => {
        await expect(fromActionWallet.execute(to, value, removeKeyData)).to.be.reverted;
      });

      it('Fails execute removeKey on self with unknown key', async () => {
        await expect(fromUnknownWallet.execute(to, value, removeKeyData)).to.be.reverted;
      });
    });
  });

  describe('Execute signed', async () => {
    let signature;
    beforeEach(async () => {
      signature = messageSignature(wallet, toTarget, amount, data);
    });

    it('Get signer work correctly', async () => {
      const message = utils.arrayify(utils.solidityKeccak256(['address', 'uint256', 'bytes'],[toTarget, amount, data]));
      const correctSigner = utils.hexlify(addressToBytes32(Wallet.verifyMessage(message, signature)));
      expect(await identity.getSigner(toTarget, amount, data, signature)).to.eq(correctSigner);
    });

    it('Should allow to add execution with valid message signature', async () => {
      await expect(identity.executeSigned(toTarget, amount, data, signature)).to
        .emit(identity, 'ExecutionRequested');
      const execution = await identity.executions(id);
      expect(execution[0]).to.eq(toTarget);
    });

    it('Should not allow to add execution with invalid message signature', async () => {
      await expect(identity.executeSigned(toTarget, amount, data, signature + 1)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect target address', async () => {
      await expect(identity.executeSigned(anotherWallet.address, amount, data, signature)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect amount', async () => {
      await expect(identity.executeSigned(toTarget, 4, data, signature)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect data', async () => {
      await expect(identity.executeSigned(toTarget, amount, ['0x16'], signature)).to.be.reverted;
    });

    it('Should allow to add execution unknown sender', async () => {
      await fromUnknownWallet.executeSigned(toTarget, amount, data, signature);
      const execution = await identity.executions(id);
      expect(execution[0]).to.eq(toTarget);
    });

    it('Should allow to add execution signed by action key', async () => {
      signature = messageSignature(actionWallet, toTarget, amount, data);
      await fromUnknownWallet.executeSigned(toTarget, amount, data, signature);
      const execution = await identity.executions(id);
      expect(execution[0]).to.eq(toTarget);
    });

    it('Should not allow to add execution signed by unknown key', async () => {
      signature = messageSignature(unknownWallet, toTarget, amount, data);
      await expect(fromUnknownWallet.executeSigned(toTarget, amount, data, signature)).to.be.reverted;
    });

    describe('On self execute signed', async () => {
      it('Should allow to add execution on self signed by management key', async () => {
        signature = messageSignature(wallet, identity.address, amount, data);
        await identity.executeSigned(identity.address, amount, data, signature);
        const execution = await identity.executions(id);
        expect(execution[0]).to.eq(identity.address);
      });

      it('Should not allow to add execution on self signed by action key', async () => {
        signature = messageSignature(actionWallet, identity.address, amount, data);
        await expect(fromUnknownWallet.executeSigned(identity.address, amount, data, signature)).to.be.reverted;
      });

      it('Should not allow to add execution on self signed by unknown key', async () => {
        signature = messageSignature(unknownWallet, identity.address, amount, data);
        await expect(identity.executeSigned(identity.address, amount, data, signature)).to.be.reverted;
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
