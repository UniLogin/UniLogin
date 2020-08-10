import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {EncryptedWalletHandler} from '../../../src/core/services/EncryptedWalletHandler';
import {TEST_ENCRYPTED_WALLET_JSON, StoredEncryptedWallet} from '@unilogin/commons';
import {expect} from 'chai';
import {createTestEmailConfirmation} from '../../testhelpers/createTestEmailConfirmation';
import {EmailConfirmationValidator} from '../../../src/core/services/validators/EmailConfirmationValidator';

describe('INT: EncryptedWalletHandler', () => {
  const confirmedEmail = 'confirmed@email.com';
  const notConfirmedEmail = 'notConfirmed@email.com';
  let encryptedWalletHandler: EncryptedWalletHandler;
  let storedEncryptedWallet: StoredEncryptedWallet;
  let confirmationCode: string;
  const knex = getKnexConfig();

  before(() => {
    const emailConfirmationsStore = new EmailConfirmationsStore(knex);
    const encryptedWalletsStore = new EncryptedWalletsStore(knex);
    encryptedWalletHandler = new EncryptedWalletHandler(emailConfirmationsStore, new EmailConfirmationValidator(), encryptedWalletsStore);

    const emailConfirmation = createTestEmailConfirmation({email: notConfirmedEmail});
    confirmationCode = emailConfirmation.code;

    storedEncryptedWallet = {
      email: notConfirmedEmail,
      ensName: emailConfirmation.ensName,
      walletJSON: TEST_ENCRYPTED_WALLET_JSON,
    };

    emailConfirmationsStore.add(emailConfirmation);
    emailConfirmationsStore.add({...emailConfirmation, email: confirmedEmail, isConfirmed: true});
  });

  it('Should handle wallet with confirmed email', async () => {
    expect(await encryptedWalletHandler.handle({...storedEncryptedWallet, email: confirmedEmail}, confirmationCode)).be.deep.eq(confirmedEmail);
  });

  it('Should reject handling wallet with not confirmed email', async () => {
    await expect(encryptedWalletHandler.handle(storedEncryptedWallet, confirmationCode)).to.be.rejectedWith(`${notConfirmedEmail} is not confirmed`);
  });

  it('Should reject handling wallet with invalid code', async () => {
    await expect(encryptedWalletHandler.handle({...storedEncryptedWallet, email: confirmedEmail}, 'invalidCode')).to.be.rejectedWith('Invalid code: invalidCode');
  });

  after(async () => {
    await knex.destroy();
  });
});
