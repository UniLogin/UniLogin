import {expect} from 'chai';
import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {calculateMessageHash, GAS_BASE, GAS_FIXED} from '@universal-login/commons';
import {waitExpect} from '@universal-login/commons/testutils';
import {executeSetRequiredSignatures, mockContracts} from '@universal-login/contracts/testutils';
import {transferMessage, addKeyMessage, removeKeyMessage} from '../../../../fixtures/basicWalletContract';
import setupMessageService from '../../../../testhelpers/setupMessageService';
import {getConfig} from '../../../../../src';
import {getKnexConfig} from '../../../../testhelpers/knex';
import {clearDatabase} from '../../../../../src/http/relayers/RelayerUnderTest';
import {getTestSignedMessage} from '../../../../testconfig/message';

describe('INT: MultiSignatureExecute', async () => {
  let messageHandler;
  let provider;
  let wallet;
  let walletContract;
  let msg;
  let otherWallet;
  let actionKey;
  let executionWorker;
  const config = getConfig('test');
  const knex = getKnexConfig();

  beforeEach(async () => {
    ({wallet, actionKey, provider, messageHandler, walletContract, otherWallet, executionWorker} = await setupMessageService(knex, config));
    await executeSetRequiredSignatures(walletContract, 2, wallet.privateKey);
    msg = {...transferMessage, from: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
    executionWorker.start();
  });

  afterEach(async () => {
    executionWorker.stopLater();
    await clearDatabase(knex);
  });

  it('Error when not enough tokens', async () => {
    const mockToken = await deployContract(wallet, mockContracts.MockToken);
    await mockToken.transfer(walletContract.address, 1);

    const message = {...msg, gasToken: mockToken.address, refundReceiver: wallet.address};
    const signedMessage0 = getTestSignedMessage(message, wallet.privateKey);
    const signedMessage1 = getTestSignedMessage(message, actionKey);
    await messageHandler.handleMessage(signedMessage0);
    const {messageHash} = await messageHandler.handleMessage(signedMessage1);
    await executionWorker.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry.error).to.be.eq('Error: Not enough tokens');
  });

  it('Error when not enough gas', async () => {
    const message0 = {...msg, gasLimit: 120000, refundReceiver: wallet.address};
    const signedMessage0 = getTestSignedMessage(message0, wallet.privateKey);
    await messageHandler.handleMessage(signedMessage0);

    const safeTxGas = 1;
    const baseGas = 7696;
    const gasLimit = utils.bigNumberify(baseGas + safeTxGas).add(GAS_FIXED);
    const message1 = {...msg, gasLimit};
    const signedMessage1 = getTestSignedMessage(message1, actionKey);
    await expect(messageHandler.handleMessage(signedMessage1)).to.be.rejectedWith(`Insufficient Gas. Got safeTxGas 1 but should greater than ${GAS_BASE}`);
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signedMessage0 = getTestSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = getTestSignedMessage(msg, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      const {messageHash} = await messageHandler.handleMessage(signedMessage1);
      await executionWorker.stopLater();
      expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
      const {state, transactionHash} = await messageHandler.getStatus(messageHash);
      expect(transactionHash).to.not.be.null;
      expect(state).to.be.eq('Success');
    });
  });

  describe('Add Key', async () => {
    beforeEach(async () => {
      msg = {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
    });

    it('execute add key', async () => {
      const signedMessage0 = getTestSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = getTestSignedMessage(msg, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      await executionWorker.stopLater();
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
    });

    describe('Query message status', async () => {
      it('should get pending execution status', async () => {
        const signedMessage0 = getTestSignedMessage(msg, wallet.privateKey);
        const signedMessage1 = getTestSignedMessage(msg, actionKey);
        const messageHash = await calculateMessageHash(signedMessage1);

        await messageHandler.handleMessage(signedMessage0);
        await messageHandler.handleMessage(signedMessage1);
        const status = await messageHandler.getStatus(messageHash);
        expect(status.required).to.be.eq(2);
        expect(status.totalCollected).to.be.eq(status.required);
        await executionWorker.stopLater();
      });

      it('should fail to get pending execution status when there it is unable to find it', async () => {
        await expect(messageHandler.getStatus('0x0')).become(null);
        await executionWorker.stopLater();
      });
    });
  });

  describe('Remove key ', async () => {
    beforeEach(async () => {
      const message = {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
      const signedMessage0 = getTestSignedMessage(message, wallet.privateKey);
      const signedMessage1 = getTestSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
    });

    it('should remove key', async () => {
      await waitExpect(async () => expect((await walletContract.keyExist(otherWallet.address))).to.be.true);
      const message = {...removeKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce(), refundReceiver: wallet.address};
      const signedMessage0 = getTestSignedMessage(message, wallet.privateKey);
      const signedMessage1 = getTestSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      await executionWorker.stopLater();
      expect((await walletContract.keyExist(otherWallet.address))).to.be.false;
    });
  });

  after(async () => {
    await knex.destroy();
  });
});
