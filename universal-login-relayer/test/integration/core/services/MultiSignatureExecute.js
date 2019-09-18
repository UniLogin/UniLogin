import {expect} from 'chai';
import {deployContract} from 'ethereum-waffle';
import MockToken from '@universal-login/contracts/build/MockToken';
import {calculateMessageHash, waitExpect} from '@universal-login/commons';
import {messageToSignedMessage} from '@universal-login/contracts';
import {executeSetRequiredSignatures} from '@universal-login/contracts/testutils';
import {transferMessage, addKeyMessage, removeKeyMessage} from '../../../fixtures/basicWalletContract';
import setupMessageService from '../../../helpers/setupMessageService';
import {getKnexConfig} from '../../../helpers/knex';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

describe('INT: MultiSignatureExecute', async () => {
  let messageHandler;
  let provider;
  let wallet;
  let walletContract;
  let msg;
  let otherWallet;
  let actionKey;
  const knex = getKnexConfig();

  beforeEach(async () => {
    ({wallet, actionKey, provider, messageHandler, walletContract, otherWallet} = await setupMessageService(knex));
    await executeSetRequiredSignatures(walletContract, 2, wallet.privateKey);
    msg = {...transferMessage, from: walletContract.address, nonce: await walletContract.lastNonce()};
    messageHandler.start();
  });

  afterEach(async () => {
    messageHandler.stopLater();
    await clearDatabase(knex);
  });

  it('Error when not enough tokens', async () => {
    const mockToken = await deployContract(wallet, MockToken);
    await mockToken.transfer(walletContract.address, 1);

    const message = {...msg, gasToken: mockToken.address};
    const signedMessage0 = messageToSignedMessage(message, wallet.privateKey);
    const signedMessage1 = messageToSignedMessage(message, actionKey);
    await messageHandler.handleMessage(signedMessage0);
    const {messageHash} = await messageHandler.handleMessage(signedMessage1);
    await messageHandler.stopLater();
    const messageEntry = await messageHandler.getStatus(messageHash);
    expect(messageEntry.error).to.be.eq('Error: Not enough tokens');
  });

  it('Error when not enough gas', async () => {
    const message0 = {...msg, gasLimit: 120000};
    const signedMessage0 = messageToSignedMessage(message0, wallet.privateKey);
    await messageHandler.handleMessage(signedMessage0);

    const gasLimitExecution = 1;
    const gasData = 7696;
    const gasLimit = gasData + gasLimitExecution;
    const message1 = {...msg, gasLimit};
    const signedMessage1 = messageToSignedMessage(message1, actionKey);
    await expect(messageHandler.handleMessage(signedMessage1)).to.be.rejectedWith('Insufficient Gas. Got GasLimitExecution 1 but should greater than 105000');
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signedMessage0 = messageToSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = messageToSignedMessage(msg, actionKey);
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
    beforeEach(async () => {
      msg = {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce()};
    });

    it('execute add key', async () => {
      const signedMessage0 = messageToSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = messageToSignedMessage(msg, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      await messageHandler.stopLater();
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
    });

    describe('Query message status', async () => {
      it('should get pending execution status', async () => {
        const signedMessage0 = messageToSignedMessage(msg, wallet.privateKey);
        const signedMessage1 = messageToSignedMessage(msg, actionKey);
        const messageHash = await calculateMessageHash(signedMessage1);

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
      const message =  {...addKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce()};
      const signedMessage0 = messageToSignedMessage(message, wallet.privateKey);
      const signedMessage1 = messageToSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
    });

    it('should remove key', async () => {
      await waitExpect(async () => expect((await walletContract.keyExist(otherWallet.address))).to.be.true);
      const message =  {...removeKeyMessage, from: walletContract.address, to: walletContract.address, nonce: await walletContract.lastNonce()};
      const signedMessage0 = messageToSignedMessage(message, wallet.privateKey);
      const signedMessage1 = messageToSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      await messageHandler.stopLater();
      expect((await walletContract.keyExist(otherWallet.address))).to.be.false;
    });
  });

  after(async () => {
    await knex.destroy();
  });
});
