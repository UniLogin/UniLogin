import {expect} from 'chai';
import Knex from 'knex';
import {TEST_ENCRYPTED_WALLET_JSON, StoredEncryptedWallet, TEST_CONTRACT_ADDRESS} from '@unilogin/commons';
import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {RestoreWalletHandler} from '../../../src/core/services/RestoreWalletHandler';
import {EmailConfirmationValidator} from '../../../src/core/services/validators/EmailConfirmationValidator';
import {EncryptedWalletHandler} from '../../../src/core/services/EncryptedWalletHandler';
import {EmailConfirmationHandler} from '../../../src/core/services/EmailConfirmationHandler';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';

const mockEmailService = (cb: any): any => ({
  sendConfirmationMail: (email: string, code: string) => new Promise((resolve) => {
    cb(code);
    resolve();
  }),
});

describe('INT: RestoreWalletHandler', () => {
  const ensName = 'name.mylogin.eth';
  const email = 'name@gmail.com';
  let knex: Knex;
  let restoreWalletHandler: RestoreWalletHandler;
  let storedEncryptedWallet: StoredEncryptedWallet;
  let encryptedWalletHandler: EncryptedWalletHandler;
  let emailConfirmationHandler: EmailConfirmationHandler;
  let sentCode: string;

  beforeEach(() => {
    knex = getKnexConfig();
    const emailConfirmationsStore = new EmailConfirmationsStore(knex);
    const encryptedWalletsStore = new EncryptedWalletsStore(knex);
    const validator = new EmailConfirmationValidator();
    emailConfirmationHandler = new EmailConfirmationHandler(emailConfirmationsStore, mockEmailService((code: string) => {sentCode = code;}), validator, {} as any);
    encryptedWalletHandler = new EncryptedWalletHandler(emailConfirmationsStore, validator, encryptedWalletsStore);
    restoreWalletHandler = new RestoreWalletHandler(emailConfirmationsStore, validator, encryptedWalletsStore);
  });

  it('restore wallet roundtrip', async () => {
    await emailConfirmationHandler.request(email, ensName);
    storedEncryptedWallet = {
      email, ensName, walletJSON: TEST_ENCRYPTED_WALLET_JSON, contractAddress: TEST_CONTRACT_ADDRESS,
    };
    await emailConfirmationHandler.confirm(email, sentCode);
    await encryptedWalletHandler.handle(storedEncryptedWallet, sentCode);
    await emailConfirmationHandler.request(email, ensName);
    const result = await restoreWalletHandler.handle(email, sentCode);
    expect(result.walletJSON).be.deep.eq(TEST_ENCRYPTED_WALLET_JSON);
  });

  it('negative scenario of restoring wallet', async () => {
    await emailConfirmationHandler.request(email, ensName);
    storedEncryptedWallet = {
      email, ensName, walletJSON: TEST_ENCRYPTED_WALLET_JSON, contractAddress: TEST_CONTRACT_ADDRESS,
    };
    await emailConfirmationHandler.confirm(email, sentCode);
    await encryptedWalletHandler.handle(storedEncryptedWallet, sentCode);
    await emailConfirmationHandler.request(email, ensName);
    await expect(restoreWalletHandler.handle(email, '000000')).to.be.rejectedWith('Invalid code');
  });

  afterEach(async () => {
    await clearDatabase(knex);
    await knex.destroy();
  });
});
