import {expect} from 'chai';
import {utils} from 'ethers';
import {ACTION_KEY, calculateMessageHash, createSignedMessage} from '@universal-login/commons';
import {transferMessage, addKeyMessage, removeKeyMessage} from '../../fixtures/basicWalletContract';
import setupTransactionService from '../../helpers/setupTransactionService';
import {getKnex} from '../../../lib/utils/knexUtils';

describe('Relayer - MultiSignatureExecute', async () => {
  let messageHandler;
  let provider;
  let wallet;
  let mockToken;
  let walletContract;
  let msg;
  let otherWallet;
  let actionKey;
  const knex = getKnex();

  beforeEach(async () => {
    ({wallet, actionKey, provider, messageHandler, mockToken, walletContract, otherWallet} = await setupTransactionService(knex));
    msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address};
    await walletContract.setRequiredSignatures(2);
    await knex.delete().from('signature_key_pairs');
    await knex.delete().from('messages');
  });

  it('Error when not enough tokens', async () => {
    const message = {...msg, gasLimit: utils.parseEther('2.0')};
    const signedMessage0 = await createSignedMessage(message, wallet.privateKey);
    const signedMessage1 = await createSignedMessage(message, actionKey);
    await messageHandler.handleMessage(signedMessage0);
    await expect(messageHandler.handleMessage(signedMessage1))
      .to.be.eventually.rejectedWith('Not enough tokens');
  });

  it('Error when not enough gas', async () => {
    const message = {...msg, gasLimit: 100};
    const signedMessage0 = await createSignedMessage(message, wallet.privateKey);
    const signedMessage1 = await createSignedMessage(message, actionKey);
    await messageHandler.handleMessage(signedMessage0);
    await expect(messageHandler.handleMessage(signedMessage1)).to.be.eventually.rejectedWith('Not enough gas');
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signedMessage0 = await createSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = await createSignedMessage(msg, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
    });
  });

  describe('Add Key', async () => {
    it('execute add key', async () => {
      msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage0 = await createSignedMessage(msg, wallet.privateKey);
      const signedMessage1 = await createSignedMessage(msg, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.eq(ACTION_KEY);
    });

    describe('Query transaction status', async () => {
      it('should get pending execution status', async () => {
        const signedMessage0 = await createSignedMessage(msg, wallet.privateKey);
        const signedMessage1 = await createSignedMessage(msg, actionKey);
        const messageHash = await calculateMessageHash(msg);
        await messageHandler.handleMessage(signedMessage0);
        await messageHandler.handleMessage(signedMessage1);
        const status = await messageHandler.getStatus(messageHash);
        expect(status).to.be.null;
      });

      it('should fail to get pending execution status when there it is unable to find it', async () => {
        await expect(messageHandler.getStatus('0x0')).become(null);
      });
    });
  });

  describe('Remove key ', async () => {
    beforeEach(async () => {
      const message =  {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage0 = await createSignedMessage(message, wallet.privateKey);
      const signedMessage1 = await createSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
    });

    it('should remove key', async () => {
      expect((await walletContract.getKeyPurpose(otherWallet.address))).to.eq(ACTION_KEY);
      const message =  {...removeKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signedMessage0 = await createSignedMessage(message, wallet.privateKey);
      const signedMessage1 = await createSignedMessage(message, actionKey);
      await messageHandler.handleMessage(signedMessage0);
      await messageHandler.handleMessage(signedMessage1);
      expect((await walletContract.keyExist(otherWallet.address))).to.eq(false);
    });
  });

  after(async () => {
    await knex.delete().from('signature_key_pairs');
    await knex.delete().from('messages');
    await knex.delete().from('authorisations');
    await knex.destroy();
  });
});
