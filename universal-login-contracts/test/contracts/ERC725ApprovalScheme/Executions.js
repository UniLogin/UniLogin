import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ERC725ApprovalScheme from '../../../build/ERC725ApprovalScheme';
import MockContract from '../../../build/MockContract';
import {createMockProvider, deployContract, getWallets, solidity, loadFixture} from 'ethereum-waffle';
import basicERC725 from '../../fixtures/basicERC725';
import {addressToBytes32} from '../../utils';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from '../../../lib/consts';

chai.use(chaiAsPromised);
chai.use(solidity);

const amount = utils.parseEther('0.1');

describe('Key holder: executions', async () => {
  let provider;
  let wallet;
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

  let addKeyData;
  let removeKeyData;

  beforeEach(async () => {
    ({provider, wallet, managementWallet, actionWallet, unknownWallet, anotherWallet,
      managementKey, managementWalletKey, actionWalletKey, actionKey, identity, mockContract,
      fromActionWallet, fromUnknownWallet
    } =
      await loadFixture(basicERC725));
    mockContractAddress = mockContract.address;

    addKeyData = identity.interface.functions.addKey.encode([actionKey, ACTION_KEY, ECDSA_TYPE]);
    removeKeyData = identity.interface.functions.removeKey.encode([actionKey, ACTION_KEY]);
    functionData = mockContract.interface.functions.callMe.encode([]);
    await wallet.sendTransaction({to: identity.address, value: amount});
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
