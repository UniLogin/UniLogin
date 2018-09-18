import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import KeyHolder from '../../../build/KeyHolder';
import MockContract from '../../../build/MockContract';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import {addressToBytes32, messageSignature} from '../../../lib/utils/utils';
import {utils, Wallet} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../../lib/const';

chai.use(chaiAsPromised);
chai.use(solidity);

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
  let fromUnknownWallet;
  let fromActionWallet;

  let managementWalletKey;

  let managementKey;
  let actionKey;
  let actionWalletKey;
  let functionData;

  let mockContractAddress;
  let targetAddress;
  const amount = utils.parseEther('0.1');
  const data = utils.hexlify(0);


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

    fromActionWallet = await contractWithWallet(identity, actionWallet);
    fromUnknownWallet = await contractWithWallet(identity, unknownWallet);

    mockContractAddress = mockContract.address;
    targetAddress = targetWallet.address;


    await identity.addKey(managementWalletKey, MANAGEMENT_KEY, ECDSA_TYPE);
    await identity.addKey(actionWalletKey, ACTION_KEY, ECDSA_TYPE);

    addKeyData = identity.interface.functions.addKey(actionKey, ACTION_KEY, ECDSA_TYPE).data;
    removeKeyData = identity.interface.functions.removeKey(actionKey, ACTION_KEY).data;
    functionData = mockContract.interface.functions.callMe().data;
    await wallet.send(identity.address, amount);
  });

  describe('Execute', async () => {
    it('Should emit ExecutionRequested event correctly', async () => {
      await expect(identity.execute(mockContractAddress, 0, functionData)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(0, mockContractAddress, 0, functionData);
    });

    it('Should add executions successfully', async () => {
      const firstNonce = await identity.executionNonce();
      await identity.execute(mockContractAddress, 0, functionData);
      const actualNonce = await identity.executionNonce();
      expect(firstNonce).not.to.eq(actualNonce);
      const execution = await identity.executions(firstNonce);
      expect(execution[0]).to.eq(mockContractAddress);
      expect(execution[1]).to.eq(0);
      expect(execution[2]).to.eq(functionData);
    });

    it('Should not allow to add execution with unknown key', async () => {
      await expect(fromUnknownWallet.execute(mockContractAddress, 0, functionData)).to.be.reverted;
    });

    it('Should allow to add execution with action key', async () => {
      await expect(fromActionWallet.execute(mockContractAddress, 0, functionData)).to
        .emit(identity, 'ExecutionRequested')
        .withArgs(0, mockContractAddress, 0, functionData);
    });

    describe('On self execute', async () => {
      it('Execute addKey on self with management key', async () => {
        await expect(identity.execute(identity.address, 0, addKeyData)).to
          .emit(identity, 'ExecutionRequested')
          .withArgs(0, identity.address, 0, addKeyData);
      });

      it('Fails execute addKey on self with action key', async () => {
        await expect(fromActionWallet.execute(identity.address, 0, addKeyData)).to.be.reverted;
      });

      it('Fails execute addKey on self with unknown key', async () => {
        await expect(fromUnknownWallet.execute(identity.address, 0, addKeyData)).to.be.reverted;
      });

      it('Execute removeKey on self if with management key', async () => {
        await expect(identity.execute(identity.address, 0, removeKeyData)).to
          .emit(identity, 'ExecutionRequested')
          .withArgs(0, identity.address, 0, removeKeyData);
      });

      it('Fails execute removeKey on self with action key', async () => {
        await expect(fromActionWallet.execute(identity.address, 0, removeKeyData)).to.be.reverted;
      });

      it('Fails execute removeKey on self with unknown key', async () => {
        await expect(fromUnknownWallet.execute(identity.address, 0, removeKeyData)).to.be.reverted;
      });
    });
  });

  describe('Execute signed', async () => {
    let signature;
    beforeEach(async () => {
      signature = messageSignature(wallet, targetAddress, amount, data);
    });

    it('Get signer for executions work correctly', async () => {
      const message = utils.arrayify(utils.solidityKeccak256(['address', 'uint256', 'bytes'],[targetAddress, amount, data]));
      const correctSigner = utils.hexlify(addressToBytes32(Wallet.verifyMessage(message, signature)));
      expect(await identity.getSignerForExecutions(targetAddress, amount, data, signature)).to.eq(correctSigner);
    });

    it('Should allow to add execution with valid message signature', async () => {
      await expect(identity.executeSigned(targetAddress, amount, data, signature)).to
        .emit(identity, 'ExecutionRequested');
      const execution = await identity.executions(0);
      expect(execution[0]).to.eq(targetAddress);
    });

    it('Should not allow to add execution with invalid message signature', async () => {
      await expect(identity.executeSigned(targetAddress, amount, data, signature + 1)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect target address', async () => {
      await expect(identity.executeSigned(anotherWallet.address, amount, data, signature)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect amount', async () => {
      await expect(identity.executeSigned(targetAddress, 4, data, signature)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect data', async () => {
      await expect(identity.executeSigned(targetAddress, amount, ['0x16'], signature)).to.be.reverted;
    });

    it('Should allow to add execution unknown sender', async () => {
      await fromUnknownWallet.executeSigned(targetAddress, amount, data, signature);
      const execution = await identity.executions(0);
      expect(execution[0]).to.eq(targetAddress);
    });

    it('Should allow to add execution signed by action key', async () => {
      signature = messageSignature(actionWallet, targetAddress, amount, data);
      await fromUnknownWallet.executeSigned(targetAddress, amount, data, signature);
      const execution = await identity.executions(0);
      expect(execution[0]).to.eq(targetAddress);
    });

    it('Should not allow to add execution signed by unknown key', async () => {
      signature = messageSignature(unknownWallet, targetAddress, amount, data);
      await expect(fromUnknownWallet.executeSigned(targetAddress, amount, data, signature)).to.be.reverted;
    });

    describe('On self execute signed', async () => {
      it('Should allow to add execution on self signed by management key', async () => {
        signature = messageSignature(wallet, identity.address, amount, data);
        await identity.executeSigned(identity.address, amount, data, signature);
        const execution = await identity.executions(0);
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
    it('Success call function', async () => {
      await identity.execute(mockContractAddress, 0, functionData);
      await identity.approve(0);
      const wasCalled = await mockContract.wasCalled();
      expect(wasCalled).to.be.true;
    });

    it('Should emit Executed event', async () => {
      await expect(identity.execute(mockContractAddress, 0, functionData)).to
        .emit(identity, 'Executed')
        .withArgs(0, mockContractAddress, 0, functionData);
    });

    it('Should emit ExecutionFailed', async () => {
      await expect(identity.execute(mockContractAddress, amount, functionData)).to
        .emit(identity, 'ExecutionFailed')
        .withArgs(0, mockContractAddress, amount, functionData);
    });
  });
});
