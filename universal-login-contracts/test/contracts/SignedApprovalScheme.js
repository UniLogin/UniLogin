import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import SignedApprovalScheme from '../../build/SignedApprovalScheme';
import MockContract from '../../build/MockContract';
import MockToken from '../../build/MockToken';
import {createMockProvider, deployContract, getWallets, solidity, contractWithWallet} from 'ethereum-waffle';
import {addressToBytes32, messageSignature, messageSignatureForApprovals} from '../utils';
import {utils, Wallet, Interface} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE} from 'universal-login-contracts/lib/consts';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';

chai.use(chaiAsPromised);
chai.use(solidity);

const amount = utils.parseEther('0.1');
const data = utils.hexlify(0);
const {gasToken, gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('Signed approval scheme', async () => {
  let provider;
  let wallet;
  let targetWallet;
  let anotherWallet;
  let managementWallet;
  let actionWallet;
  let unknownWallet;

  let identity;
  let mockContract;
  let mockToken;
  let fromManagementWallet;
  let fromUnknownWallet;
  let fromActionWallet;

  let managementWalletKey;

  let managementKey;
  let actionKey;
  let actionWalletKey;
  let functionData;
  let signature;

  let mockContractAddress;
  let targetAddress;
  let targetBalance;
  let targetBalanceAfterSend;

  let signatureForApprovals;

  let addKeyData;

  const isActionKey = () => identity.keyHasPurpose(actionKey, ACTION_KEY);

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, managementWallet, actionWallet, unknownWallet, anotherWallet, targetWallet] = await getWallets(provider);

    managementKey = addressToBytes32(wallet.address);
    managementWalletKey = addressToBytes32(managementWallet.address);
    actionWalletKey = addressToBytes32(actionWallet.address);
    actionKey = addressToBytes32(anotherWallet.address);

    identity = await deployContract(wallet, SignedApprovalScheme, [managementKey]);
    mockContract = await deployContract(wallet, MockContract);
    mockToken = await deployContract(wallet, MockToken);

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
    await wallet.send(identity.address, utils.parseEther('5'));
  });

  describe('Execute signed', async () => {
    let signature;

    beforeEach(async () => {
      signature = messageSignature(
        wallet, targetAddress, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit);
    });

    it('Get signer for executions work correctly', async () => {
      const message = utils.arrayify(utils.solidityKeccak256(
        ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
        [targetAddress, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit]));
      const correctSigner = utils.hexlify(addressToBytes32(Wallet.verifyMessage(message, signature)));
      expect(await identity.getSignerForExecutions(targetAddress, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit, signature))
        .to.eq(correctSigner);
    });

    it('Should allow to add execution with valid message signature', async () => {
      await expect(identity.executeSigned(targetAddress, amount, data, 0, gasToken, gasPrice, gasLimit, signature)).to
        .emit(identity, 'ExecutionRequested');
      const execution = await identity.executions(0);
      expect(execution[0]).to.eq(targetAddress);
    });

    it('Should not allow to add execution with invalid message signature', async () => {
      await expect(identity.executeSigned(targetAddress, amount, data, 0, gasToken, gasPrice, gasLimit, signature + 1)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect target address', async () => {
      await expect(identity.executeSigned(anotherWallet.address, amount, data, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect amount', async () => {
      await expect(identity.executeSigned(targetAddress, 4, data, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
    });

    it('Should not allow to add execution with incorrect data', async () => {
      await expect(identity.executeSigned(targetAddress, amount, ['0x16'], 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
    });

    it('Should allow to add execution unknown sender', async () => {
      await fromUnknownWallet.executeSigned(targetAddress, amount, data, 0, gasToken, gasPrice, gasLimit, signature);
      const execution = await identity.executions(0);
      expect(execution[0]).to.eq(targetAddress);
    });

    it('Should allow to add execution signed by action key', async () => {
      signature = messageSignature(actionWallet, targetAddress, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit);
      await fromUnknownWallet.executeSigned(targetAddress, amount, data, 0, gasToken, gasPrice, gasLimit, signature);
      const execution = await identity.executions(0);
      expect(execution[0]).to.eq(targetAddress);
    });

    it('Should not allow to add execution signed by unknown key', async () => {
      signature = messageSignature(unknownWallet, targetAddress, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit);
      await expect(fromUnknownWallet.executeSigned(targetAddress, amount, data, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
    });

    describe('On self execute signed', async () => {
      it('Should allow to add execution on self signed by management key', async () => {
        signature = messageSignature(wallet, identity.address, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit);
        await identity.executeSigned(identity.address, amount, data, 0, gasToken, gasPrice, gasLimit, signature);
        const execution = await identity.executions(0);
        expect(execution[0]).to.eq(identity.address);
      });

      it('Should not allow to add execution on self signed by action key', async () => {
        signature = messageSignature(actionWallet, identity.address, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit);
        await expect(fromUnknownWallet.executeSigned(identity.address, amount, data, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
      });

      it('Should not allow to add execution on self signed by unknown key', async () => {
        signature = messageSignature(unknownWallet, identity.address, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit);
        await expect(identity.executeSigned(identity.address, amount, data, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
      });
    });

    describe('Refund', async () => {
      it('Should refund after execute', async () => {
        const gasPrice = utils.parseEther('0.00011');
        const amount = utils.parseEther('0.2');
        signature = messageSignature(
          wallet, targetAddress, identity.address, amount, data, 0, mockToken.address, gasPrice, gasLimit);
        await mockToken.transfer(identity.address, utils.parseEther('20'));
        const relayerTokenBalance = await mockToken.balanceOf(wallet.address);
        const executeData = new Interface(SignedApprovalScheme.interface).functions.executeSigned(targetAddress, amount, data, 0, mockToken.address, gasPrice, gasLimit, signature).data;
        const transaction = {
          value: 0,
          to: identity.address,
          data: executeData,
          gasPrice,
          gasLimit
        };
        const estimateGas = await wallet.estimateGas(transaction);
        await identity.executeSigned(targetAddress, amount, data, 0, mockToken.address, gasPrice, gasLimit, signature);
        const expectedIncome = estimateGas.mul(gasPrice);
        expect(await mockToken.balanceOf(wallet.address)).to.be.below(relayerTokenBalance.add(expectedIncome));
        expect(await mockToken.balanceOf(wallet.address)).to.be.above(relayerTokenBalance.add(estimateGas));
      });
    });
  });
  describe('Approve signed', async () => {
    describe('0 keys needed', async () => {
      it('Execute transfer', async () => {
        signature = messageSignature(wallet, targetAddress, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit);
        await identity.executeSigned(targetAddress, amount, data, 0, gasToken, gasPrice, gasLimit, signature);
        const targetBalanceAfterSend = await targetWallet.getBalance();
        expect(targetBalanceAfterSend).to.eq(amount.add(targetBalance));
      });
  
      it('Execute call on self', async () => {
        signature = messageSignature(wallet, identity.address, identity.address, 0, addKeyData, 0, gasToken, gasPrice, gasLimit);
        await identity.executeSigned(identity.address, 0, addKeyData, 0, gasToken, gasPrice, gasLimit, signature);
        expect(await isActionKey()).to.be.true;
      });
  
      it('Execute call', async () => {
        signature = messageSignature(wallet, mockContractAddress, identity.address, 0, functionData, 0, gasToken, gasPrice, gasLimit);
        await identity.executeSigned(mockContractAddress, 0, functionData, 0, gasToken, gasPrice, gasLimit, signature);
        expect(await mockContract.wasCalled()).to.be.true;
      });
  
      it('Will not execute with unknown key', async () => {
        signature = messageSignature(unknownWallet, mockContractAddress, identity.address, 0, functionData, 0, gasToken, gasPrice, gasLimit);
        await expect(fromUnknownWallet.executeSigned(mockContractAddress, 0, functionData, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
      });
  
      it('Will not execute on self with unknown key', async () => {
        signature = messageSignature(unknownWallet, mockContractAddress, identity.address, 0, functionData, 0, gasToken, gasPrice, gasLimit);
        await expect(fromUnknownWallet.executeSigned(identity.address, 0, addKeyData, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
      });
  
      it('Will not execute on self with action key', async () => {
        signature = messageSignature(actionWallet, identity.address, identity.address, 0, addKeyData, 0, gasToken, gasPrice, gasLimit);
        await expect(fromActionWallet.executeSigned(identity.address, 0, addKeyData, 0, gasToken, gasPrice, gasLimit, signature)).to.be.reverted;
      });
  
      it('Will execute call with action key', async () => {
        signature = messageSignature(actionWallet, mockContractAddress, identity.address, 0, functionData, 0, gasToken, gasPrice, gasLimit);
        await fromActionWallet.executeSigned(mockContractAddress, 0, functionData, 0, gasToken, gasPrice, gasLimit, signature);
        expect(await mockContract.wasCalled()).to.be.true;
      });
    });
  
    describe('1 key needed', async () => {
      beforeEach(async () => {
        await identity.setRequiredApprovals(1);
        signature = messageSignature(wallet, mockContractAddress, identity.address, 0, functionData, 0, gasToken, gasPrice, gasLimit);
        await identity.executeSigned(mockContractAddress, 0, functionData, 0, gasToken, gasPrice, gasLimit, signature);
      });
  
      it('Execute transfer', async () => {
        signature = messageSignature(wallet, targetAddress, identity.address, amount, data, 1, gasToken, gasPrice, gasLimit);
        await identity.executeSigned(targetAddress, amount, data, 1 , gasToken, gasPrice, gasLimit, signature);
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
    });
    describe('Approve signed with 2 keys needed', async () => {
      beforeEach(async () => {
        await identity.setRequiredApprovals(2);
  
        await identity.executeSigned(targetAddress, amount, data, 0, gasToken, gasPrice, gasLimit,
          messageSignature(wallet, targetAddress, identity.address, amount, data, 0, gasToken, gasPrice, gasLimit));
        await identity.executeSigned(identity.address, 0, addKeyData, 1, gasToken, gasPrice, gasLimit,
          messageSignature(wallet, identity.address, identity.address, 0, addKeyData, 1, gasToken, gasPrice, gasLimit));
        await identity.executeSigned(mockContractAddress, 0, functionData, 2, gasToken, gasPrice, gasLimit, 
          messageSignature(wallet, mockContractAddress, identity.address, 0, functionData, 2, gasToken, gasPrice, gasLimit));
  
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

    describe('On self', async () => {
      beforeEach(async () => {
        signature = messageSignature(wallet, identity.address, identity.address, 0, addKeyData, 0, gasToken, gasPrice, gasLimit);
        await identity.executeSigned(identity.address, 0, addKeyData, 0, gasToken, gasPrice, gasLimit, signature);
      });

      it('Execute call on self', async () => {
        signatureForApprovals = messageSignatureForApprovals(wallet, 0);
        await identity.approveSigned(0, signatureForApprovals);
        expect(await isActionKey()).to.be.true;
      });

      it('Should not allow to approve on self with action key', async () => {
        signatureForApprovals = messageSignatureForApprovals(actionWallet, 0);
        await expect(fromActionWallet.approveSigned(1, signatureForApprovals)).to.be.reverted;
      });

      it('Should not allow to approve on self with unknown key', async () => {
        signatureForApprovals = messageSignatureForApprovals(unknownWallet, 0);
        await expect(fromUnknownWallet.approveSigned(1, signatureForApprovals)).to.be.reverted;
      });
    });
  });
});
