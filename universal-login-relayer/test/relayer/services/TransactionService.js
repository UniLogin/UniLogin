import {expect} from 'chai';
import {utils} from 'ethers';
import {ACTION_KEY, calculateMessageSignature} from '@universal-login/contracts';
import {setupTransactionService, transferMessage, addKeyMessage, removeKeyMessage} from '../../fixtures/basicWalletService';
import defaultDeviceInfo from '../../config/defaults';
import {getKnex} from '../../../lib/utils/knexUtils';

describe('Relayer - TransactionService', async () => {
  let transactionService;
  let provider;
  let authorisationService;
  let wallet;
  let mockToken;
  let walletContract;
  let msg;
  let otherWallet;
  let knex = getKnex();

  beforeEach(async () => {
    ({wallet, provider, transactionService, mockToken, authorisationService, walletContract, otherWallet} = await setupTransactionService(knex));
    msg = {...transferMessage, from: walletContract.address, gasToken: mockToken.address};
  });

  it('Error when not enough tokens', async () => {
    const message = {...msg, gasLimit: utils.parseEther('2.0')};
    const signature = await calculateMessageSignature(wallet.privateKey, message);
    expect(transactionService.executeSigned({...message, signature})).to.be.eventually.rejectedWith('Not enough tokens');
  });

  describe('Transfer', async () => {
    it('successful execution of transfer', async () => {
      const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
      const signature = await calculateMessageSignature(wallet.privateKey, msg);
      await transactionService.executeSigned({...msg, signature});
      expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
    });
  });

  describe('Add Key', async () => {
    it('execute add key', async () => {
      msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signature = await calculateMessageSignature(wallet.privateKey, msg);

      await transactionService.executeSigned({...msg, signature});
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.eq(ACTION_KEY);
    });

    describe('Collaboration with Authorisation Service', async () => {
      it('should remove request from pending authorisations if addKey', async () => {
        const request = {walletContractAddress: walletContract.address, key: otherWallet.address, deviceInfo: defaultDeviceInfo};
        await authorisationService.addRequest(request);
        msg = {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
        const signature = await calculateMessageSignature(wallet.privateKey, msg);
        await transactionService.executeSigned({...msg, signature});
        const authorisations = await authorisationService.getPendingAuthorisations(walletContract.address);
        expect(authorisations).to.deep.eq([]);
      });
    });
  });

  describe('Remove key ', async () => {
    beforeEach(async () => {
      const message =  {...addKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signature = await calculateMessageSignature(wallet.privateKey, message);

      await transactionService.executeSigned({...message, signature});
    });

    it('should remove key', async () => {
      expect((await walletContract.getKeyPurpose(otherWallet.address))).to.eq(ACTION_KEY);
      const message =  {...removeKeyMessage, from: walletContract.address, gasToken: mockToken.address, to: walletContract.address};
      const signature = await calculateMessageSignature(wallet.privateKey, message);

      await transactionService.executeSigned({...message, signature});
      expect((await walletContract.keyExist(otherWallet.address))).to.eq(false);
    });
  });

  after(async () => {
    await knex.delete().from('authorisations');
    await knex.destroy();
  });
});


