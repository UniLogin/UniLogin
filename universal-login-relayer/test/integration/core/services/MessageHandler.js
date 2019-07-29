import {expect} from 'chai';
import {utils} from 'ethers';
import {ACTION_KEY, createSignedMessage, waitExpect} from '@universal-login/commons';
import {transferMessage, addKeyMessage, removeKeyMessage} from '../../../fixtures/basicWalletContract';
import setupMessageService from '../../../helpers/setupMessageService';
import defaultDeviceInfo from '../../../config/defaults';
import {getKnex} from '../../../helpers/knex';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

describe('INT: MessageHandler', async () => {
  let messageHandler;
  let provider;
  let authorisationStore;
  let wallet;
  let mockToken;
  let walletContract;
  let msg;
  let otherWallet;
  const knex = getKnex();

  beforeEach(async () => {
    ({wallet, provider, messageHandler, mockToken, authorisationStore, walletContract, otherWallet} = await setupMessageService(knex));
    msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address};
    messageHandler.start();
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  it('Error when not enough tokens', async () => {
    const message = {...msg, gasLimit: utils.parseEther('2.0')};
    const signedMessage = createSignedMessage(message, wallet.privateKey);
    const {messageHash} = await messageHandler.handleMessage(signedMessage);
    await messageHandler.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry.error).to.be.eq('Error: Not enough tokens');
  });

  it('Error when not enough gas', async () => {
    const message = {...msg, gasLimit: 100};
    const signedMessage = createSignedMessage(message, wallet.privateKey);
    const {messageHash} = await messageHandler.handleMessage(signedMessage);
    await messageHandler.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry.error).to.be.eq('Error: Not enough gas');
    const {state} = await messageHandler.getStatus(messageHash);
    expect(state).to.be.eq('Error');
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signedMessage = createSignedMessage(msg, wallet.privateKey);
      const {messageHash} = await messageHandler.handleMessage(signedMessage);
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
      const signedMessage = createSignedMessage(msg, wallet.privateKey);

      await messageHandler.handleMessage(signedMessage);
      await messageHandler.stopLater();
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.eq(ACTION_KEY);
    });

    describe('Collaboration with Authorisation Service', async () => {
      it('should remove request from pending authorisations if addKey', async () => {
        const request = {walletContractAddress: walletContract.address, key: otherWallet.address, deviceInfo: defaultDeviceInfo};
        await authorisationStore.addRequest(request);
        msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
        const signedMessage = createSignedMessage(msg, wallet.privateKey);
        await messageHandler.handleMessage(signedMessage);
        await messageHandler.stopLater();
        const authorisations = await authorisationStore.getPendingAuthorisations(walletContract.address);
        expect(authorisations).to.deep.eq([]);
      });
    });
  });

  describe('Remove key ', async () => {
    beforeEach(async () => {
      const message =  {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage = createSignedMessage(message, wallet.privateKey);

      await messageHandler.handleMessage(signedMessage);
    });

    it('should remove key', async () => {
      await waitExpect(async () => expect((await walletContract.getKeyPurpose(otherWallet.address))).to.eq(ACTION_KEY));
      const message =  {...removeKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage = createSignedMessage(message, wallet.privateKey);

      await messageHandler.handleMessage(signedMessage);
      await messageHandler.stopLater();
      expect((await walletContract.keyExist(otherWallet.address))).to.eq(false);
    });
  });

  after(async () => {
    await knex.destroy();
  });
});


