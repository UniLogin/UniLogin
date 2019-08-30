import {expect} from 'chai';
import {utils} from 'ethers';
import {calculateMessageHash, createSignedMessage, waitExpect} from '@universal-login/commons';
import {transferMessage, addKeyMessage, removeKeyMessage} from '../../../fixtures/basicWalletContract';
import setupMessageService from '../../../helpers/setupMessageService';
import {getKnexConfig} from '../../../helpers/knex';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';


describe('INT: MultiSignatureExecute', async () => {
  let messageHandler;
  let provider;
  let wallet;
  let mockToken;
  let walletContract;
  let msg;
  let otherWallet;
  let actionKey;
  const knex = getKnexConfig();

  beforeEach(async () => {
    ({wallet, actionKey, provider, messageHandler, mockToken, walletContract, otherWallet} = await setupMessageService(knex));
    msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address};
    await walletContract.setRequiredSignatures(2);
    messageHandler.start();
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  it('Error when not enough tokens', async () => {
    const message = {...msg, gasLimit: utils.parseEther('2.0')};
    const signedMessage0 = createSignedMessage(message, wallet.privateKey);
    const signedMessage1 = createSignedMessage(message, actionKey);
    await messageHandler.handleMessage(signedMessage0);
    const {messageHash} = await messageHandler.handleMessage(signedMessage1);
    await messageHandler.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry.error).to.be.eq('Error: Not enough tokens');
  });

  it('Error when not enough gas', async () => {
    const message = {...msg, gasLimit: 100};
    const signedMessage0 = createSignedMessage(message, wallet.privateKey);
    const signedMessage1 = createSignedMessage(message, actionKey);
    await messageHandler.handleMessage(signedMessage0);
    const {messageHash} = await messageHandler.handleMessage(signedMessage1);
    await messageHandler.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry.error).to.be.eq('Error: Not enough gas');
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signedMessage0 = createSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = createSignedMessage(msg, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      const {messageHash} = await messageHandler.handleMessage(signedMessage1);
      await messageHandler.stopLater();
      expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
      const {state, transactionHash} = await messageHandler.getStatus(messageHash);
      expect(transactionHash).to.not.be.null;
      expect(state).to.be.eq('Success');
    });
  });

  describe('Add Key', async () => {
    it('execute add key', async () => {
      msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage0 = createSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = createSignedMessage(msg, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      await messageHandler.stopLater();
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
    });

    describe('Query message status', async () => {
      it('should get pending execution status', async () => {
        const signedMessage0 = createSignedMessage(msg, wallet.privateKey);
        const signedMessage1 = createSignedMessage(msg, actionKey);
        const messageHash = await calculateMessageHash(msg);
        await messageHandler.handleMessage(signedMessage0);
        await messageHandler.handleMessage(signedMessage1);
        const status = await messageHandler.getStatus(messageHash);
        expect(status.required).to.be.eq(2);
        expect(status.totalCollected).to.be.eq(status.required);
        await messageHandler.stopLater();
      });

      it('should fail to get pending execution status when there it is unable to find it', async () => {
        await expect(messageHandler.getStatus('0x0')).become(null);
        await messageHandler.stopLater();
      });
    });
  });

  describe('Remove key ', async () => {
    beforeEach(async () => {
      const message =  {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage0 = createSignedMessage(message, wallet.privateKey);
      const signedMessage1 = createSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
    });

    it('should remove key', async () => {
      await waitExpect(async () => expect((await walletContract.keyExist(otherWallet.address))).to.be.true);
      const message =  {...removeKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage0 = createSignedMessage(message, wallet.privateKey);
      const signedMessage1 = createSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      await messageHandler.stopLater();
      expect((await walletContract.keyExist(otherWallet.address))).to.eq(false);
    });
  });

  after(async () => {
    await knex.destroy();
  });
});
