import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {EncryptedWalletHandler} from '../../../src/core/services/EncryptedWalletHandler';
import {TEST_ENCRYPTED_WALLET_JSON, StoredEncryptedWallet} from '@unilogin/commons';
import {expect} from 'chai';
import {createTestEmailConfirmation} from '../../testhelpers/createTestEmailConfirmation';

describe('INT: EncryptedWalletHandler', () => {
  const notConfirmedEmail = 'notConfirmed@email.com';
  const confirmedEmail = 'confirmed@email.com';
  let encryptedWalletHandler: EncryptedWalletHandler;
  let storedEncryptedWallet: StoredEncryptedWallet;
  const knex = getKnexConfig();

  before(() => {
    const emailConfirmationsStore = new EmailConfirmationsStore(knex);
    const encryptedWalletsStore = new EncryptedWalletsStore(knex);
    encryptedWalletHandler = new EncryptedWalletHandler(emailConfirmationsStore, encryptedWalletsStore);

    const emailConfirmation = createTestEmailConfirmation(notConfirmedEmail);

    storedEncryptedWallet = {
      email: notConfirmedEmail,
      ensName: emailConfirmation.ensName,
      walletJSON: TEST_ENCRYPTED_WALLET_JSON,
    };

    emailConfirmationsStore.add(emailConfirmation);
    emailConfirmationsStore.add({...emailConfirmation, email: confirmedEmail, isConfirmed: true});
  });

  it('Should handle wallet with confirmed email', async () => {
    expect(await encryptedWalletHandler.handle({...storedEncryptedWallet, email: confirmedEmail})).be.deep.eq(confirmedEmail);
  });

  it('Should reject handling wallet with not confirmed email', async () => {
    await expect(encryptedWalletHandler.handle(storedEncryptedWallet)).to.be.rejectedWith(`${notConfirmedEmail} is not confirmed`);
  });

  after(async () => {
    await knex.destroy();
  });
});
