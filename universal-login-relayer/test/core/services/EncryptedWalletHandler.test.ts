import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {EncryptedWalletHandler} from '../../../src/core/services/EncryptedWalletHandler';
import {StoredEncryptedWallet, TEST_CONTRACT_ADDRESS, TEST_WALLET} from '@unilogin/commons';
import {expect} from 'chai';
import {createTestEmailConfirmation} from '../../testhelpers/createTestEmailConfirmation';
import {EmailConfirmationValidator} from '../../../src/core/services/validators/EmailConfirmationValidator';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';

describe('INT: EncryptedWalletHandler', () => {
  const confirmedEmail = 'confirmed@email.com';
  const notConfirmedEmail = 'notConfirmed@email.com';
  let encryptedWalletHandler: EncryptedWalletHandler;
  let storedEncryptedWallet: StoredEncryptedWallet;
  let confirmationCode: string;
  const knex = getKnexConfig();

  before(async () => {
    const emailConfirmationsStore = new EmailConfirmationsStore(knex);
    const encryptedWalletsStore = new EncryptedWalletsStore(knex);
    encryptedWalletHandler = new EncryptedWalletHandler(emailConfirmationsStore, new EmailConfirmationValidator(), encryptedWalletsStore);

    const emailConfirmation = createTestEmailConfirmation({email: notConfirmedEmail});
    confirmationCode = emailConfirmation.code;

    storedEncryptedWallet = {
      email: notConfirmedEmail,
      ensName: emailConfirmation.ensName,
      walletJSON: TEST_WALLET.encryptedWallet,
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_WALLET.address,
    };

    await emailConfirmationsStore.add(emailConfirmation);
    await emailConfirmationsStore.add({...emailConfirmation, email: confirmedEmail, isConfirmed: true});
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
    await clearDatabase(knex);
    await knex.destroy();
  });
});
