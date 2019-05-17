import {expect} from 'chai';
import {utils} from 'ethers';
import {ACTION_KEY, calculateMessageSignature, calculateMessageHash} from '@universal-login/contracts';
import {transferMessage, addKeyMessage, removeKeyMessage} from '../../../fixtures/basicWalletContract';
import setupTransactionService from '../../../helpers/setupTransactionService';
import {getKnex} from '../../../../lib/utils/knexUtils';

describe('Relayer - MultiSignatureExecute', async () => {
  let transactionService;
  let provider;
  let wallet;
  let mockToken;
  let walletContract;
  let msg;
  let otherWallet;
  let actionKey;
  const knex = getKnex();

  beforeEach(async () => {
    ({wallet, actionKey, provider, transactionService, mockToken, walletContract, otherWallet} = await setupTransactionService(knex));
    msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address};
    await walletContract.setRequiredSignatures(2);
  });

  it('Error when not enough tokens', async () => {
    const message = {...msg, gasLimit: utils.parseEther('2.0')};
    const signature0 = await calculateMessageSignature(wallet.privateKey, message);
    const signature1 = await calculateMessageSignature(actionKey, message);
    await transactionService.executeSigned({...message, signature: signature0});
    await expect(transactionService.executeSigned({...message, signature: signature1}))
      .to.be.eventually.rejectedWith('Not enough tokens');
  });

  it('Error when not enough gas', async () => {
    const message = {...msg, gasLimit: 100};
    const signature0 = await calculateMessageSignature(wallet.privateKey, message);
    const signature1 = await calculateMessageSignature(actionKey, message);
    await transactionService.executeSigned({...message, signature: signature0});
    await expect(transactionService.executeSigned({...message, signature: signature1})).to.be.eventually.rejectedWith('Not enough gas');
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signature0 = await calculateMessageSignature(wallet.privateKey, msg);
      const signature1 = await calculateMessageSignature(actionKey, msg);
      await transactionService.executeSigned({...msg, signature: signature0});
      await transactionService.executeSigned({...msg, signature: signature1});
      expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
    });
  });

  describe('Add Key', async () => {
    it('execute add key', async () => {
      msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signature0 = await calculateMessageSignature(wallet.privateKey, msg);
      const signature1 = await calculateMessageSignature(actionKey, msg);
      await transactionService.executeSigned({...msg, signature: signature0});
      await transactionService.executeSigned({...msg, signature: signature1});
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.eq(ACTION_KEY);
    });

    describe('Query transaction status', async () => {
      it('should get pending execution status', async () => {
        const signature0 = await calculateMessageSignature(wallet.privateKey, msg);
        const signature1 = await calculateMessageSignature(actionKey, msg);
        const messageHash = await calculateMessageHash(msg);
        await transactionService.executeSigned({...msg, signature: signature0});
        await transactionService.executeSigned({...msg, signature: signature1});
        const status = await transactionService.getStatus(messageHash);
        expect(status).to.be.null;
      });

      it('should fail to get pending execution status when there it is unable to find it', async () => {
        await expect(transactionService.getStatus('0x0')).become(null);
      });

      afterEach(async () => {
        transactionService.pendingExecutions = {};
      });
    });
  });

  describe('Remove key ', async () => {
    beforeEach(async () => {
      const message =  {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signature0 = await calculateMessageSignature(wallet.privateKey, message);
      const signature1 = await calculateMessageSignature(actionKey, message);
      await transactionService.executeSigned({...message, signature: signature0});
      await transactionService.executeSigned({...message, signature: signature1});
    });

    it('should remove key', async () => {
      expect((await walletContract.getKeyPurpose(otherWallet.address))).to.eq(ACTION_KEY);
      const message =  {...removeKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signature0 = await calculateMessageSignature(wallet.privateKey, message);
      const signature1 = await calculateMessageSignature(actionKey, message);
      await transactionService.executeSigned({...message, signature: signature0});
      await transactionService.executeSigned({...message, signature: signature1});
      expect((await walletContract.keyExist(otherWallet.address))).to.eq(false);
    });
  });

  afterEach(() => {
    transactionService.pendingExecutions = {};
  });

  after(async () => {
    await knex.delete().from('authorisations');
    await knex.destroy();
  });
});
