import {expect} from 'chai';
import {utils} from 'ethers';
import {createSignedMessage, waitExpect} from '@universal-login/commons';
import {encodeFunction} from '@universal-login/contracts/testutils';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {transferMessage, addKeyMessage, removeKeyMessage} from '../../../fixtures/basicWalletContract';
import setupMessageService from '../../../helpers/setupMessageService';
import defaultDeviceInfo from '../../../config/defaults';
import {getKnexConfig} from '../../../helpers/knex';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';
import {messageToSignedMessage} from '@universal-login/contracts';

describe('INT: MessageHandler', async () => {
  let messageHandler;
  let provider;
  let authorisationStore;
  let devicesStore;
  let wallet;
  let mockToken;
  let walletContract;
  let msg;
  let otherWallet;
  const knex = getKnexConfig();

  beforeEach(async () => {
    ({wallet, provider, messageHandler, mockToken, authorisationStore, walletContract, otherWallet, devicesStore} = await setupMessageService(knex));
    msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address, nonce: await walletContract.lastNonce()};
    messageHandler.start();
  });

  afterEach(async () => {
    messageHandler.stopLater();
    await clearDatabase(knex);
  });

  xit('Error when not enough tokens', async () => {
    const message = {...msg, gasLimitExecution: utils.parseEther('2.0'), gasData: 8976};
    const signedMessage = createSignedMessage(message, wallet.privateKey);
    const {messageHash} = await messageHandler.handleMessage(signedMessage);
    await messageHandler.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry.error).to.be.eq('Error: Not enough tokens');
  });

  it('Error when not enough gas', async () => {
    const message = {...msg, gasLimitExecution: 100, gasData: 8976};
    const signedMessage = createSignedMessage(message, wallet.privateKey);
    await expect(messageHandler.handleMessage(signedMessage)).to.be.rejectedWith('Insufficient Gas. gasLimitExecution: got 100 but should be greater than 105000');
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signedMessage = messageToSignedMessage(msg, wallet.privateKey);
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
      msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address, nonce: await walletContract.lastNonce()};
      const signedMessage = messageToSignedMessage(msg, wallet.privateKey);

      await messageHandler.handleMessage(signedMessage);
      await messageHandler.stopLater();
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
    });

    describe('Collaboration with Authorisation Service', async () => {
      it('should remove request from pending authorisations if addKey', async () => {
        const request = {walletContractAddress: walletContract.address, key: otherWallet.address, deviceInfo: defaultDeviceInfo};
        await authorisationStore.addRequest(request);
        msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address, nonce: await walletContract.lastNonce()};
        const signedMessage = messageToSignedMessage(msg, wallet.privateKey);
        await messageHandler.handleMessage(signedMessage);
        await messageHandler.stopLater();
        const authorisations = await authorisationStore.getPendingAuthorisations(walletContract.address);
        expect(authorisations).to.deep.eq([]);
        expect(await devicesStore.get(walletContract.address)).length(1);
      });
    });
  });

  describe('Add Keys', async () => {
    it('execute add key', async () => {
      const keys = [otherWallet.address];
      const data = encodeFunction(WalletContract, 'addKeys', [keys]);
      msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address, nonce: await walletContract.lastNonce(), data};
      const signedMessage0 = messageToSignedMessage(msg, wallet.privateKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.stopLater();
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
      const devices = await devicesStore.get(walletContract.address);
      expect(devices.map(({publicKey}) => publicKey)).to.be.deep.eq(keys);
    });
  });

  describe('Remove key ', async () => {
    beforeEach(async () => {
      const message =  {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address, nonce: await walletContract.lastNonce()};
      const signedMessage = messageToSignedMessage(message, wallet.privateKey);

      await messageHandler.handleMessage(signedMessage);
    });

    it('should remove key', async () => {
      await waitExpect(async () => expect((await walletContract.keyExist(otherWallet.address))).to.be.true);
      const message =  {...removeKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address, nonce: await walletContract.lastNonce()};
      const signedMessage = messageToSignedMessage(message, wallet.privateKey);

      await messageHandler.handleMessage(signedMessage);
      await messageHandler.stopLater();
      expect(await devicesStore.get(walletContract.address, otherWallet.address)).to.be.deep.eq([]);
      expect(await walletContract.keyExist(otherWallet.address)).to.eq(false);
    });
  });

  after(async () => {
    await knex.destroy();
  });
});


