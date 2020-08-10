import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {RestoringWalletHandler} from '../../../src/core/services/RestoringWalletHandler';
import {TEST_ENCRYPTED_WALLET_JSON, StoredEncryptedWallet} from '@unilogin/commons';
import {expect} from 'chai';
import {EmailConfirmationValidator} from '../../../src/core/services/validators/EmailConfirmationValidator';
import {EncryptedWalletHandler} from '../../../src/core/services/EncryptedWalletHandler';
import {EmailConfirmationHandler} from '../../../src/core/services/EmailConfirmationHandler';
import Knex from 'knex';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';

describe('INT: RestoringWalletHandler', () => {
  let restoringWalletHandler: RestoringWalletHandler;
  let storedEncryptedWallet: StoredEncryptedWallet;
  let emailConfirmationsStore: EmailConfirmationsStore;
  let encryptedWalletHandler: EncryptedWalletHandler;
  let emailConfirmationHandler: EmailConfirmationHandler;
  const mockEmailService = (cb: any): any => ({
    sendConfirmationMail: (email: string, code: string) => new Promise((resolve) => {
      cb(code);
      resolve();
    }),
  });

  const email = 'name@gmail.com';
  const ensName = 'name.mylogin.eth';
  let sentCode: string;

  let knex: Knex;

  beforeEach(() => {
    knex = getKnexConfig();
    emailConfirmationsStore = new EmailConfirmationsStore(knex);
    const encryptedWalletsStore = new EncryptedWalletsStore(knex);
    const validator = new EmailConfirmationValidator();
    emailConfirmationHandler = new EmailConfirmationHandler(emailConfirmationsStore, mockEmailService((code: string) => sentCode = code), validator);
    encryptedWalletHandler = new EncryptedWalletHandler(emailConfirmationsStore, validator, encryptedWalletsStore);
    restoringWalletHandler = new RestoringWalletHandler(emailConfirmationsStore, validator, encryptedWalletsStore);
  });

  it('restore wallet roundtrip', async () => {
    await emailConfirmationHandler.request(email, ensName);
    storedEncryptedWallet = {
      email, ensName, walletJSON: TEST_ENCRYPTED_WALLET_JSON,
    };
    await emailConfirmationHandler.confirm(email, sentCode);
    await encryptedWalletHandler.handle(storedEncryptedWallet, sentCode);
    await emailConfirmationHandler.request(email, ensName);
    const result = await restoringWalletHandler.handle(email, sentCode);
    expect(result.walletJSON).be.deep.eq(TEST_ENCRYPTED_WALLET_JSON);
  });

  it('negative scenario of restoring wallet', async () => {
    await emailConfirmationHandler.request(email, ensName);
    storedEncryptedWallet = {
      email, ensName, walletJSON: TEST_ENCRYPTED_WALLET_JSON,
    };
    await emailConfirmationHandler.confirm(email, sentCode);
    await encryptedWalletHandler.handle(storedEncryptedWallet, sentCode);
    await emailConfirmationHandler.request(email, ensName);
    await expect(restoringWalletHandler.handle(email, '000000')).to.be.rejectedWith('Invalid code');
  });

  afterEach(async () => {
    await clearDatabase(knex);
    await knex.destroy();
  });
});
