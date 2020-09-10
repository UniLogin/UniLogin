import {expect} from 'chai';
import Knex from 'knex';
import {StoredEncryptedWallet, TEST_CONTRACT_ADDRESS, TEST_WALLET, TEST_EMAIL, TEST_ENS_NAME, TEST_STORED_FUTURE_WALLET} from '@unilogin/commons';
import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {RestoreWalletHandler} from '../../../src/core/services/RestoreWalletHandler';
import {EmailConfirmationValidator} from '../../../src/core/services/validators/EmailConfirmationValidator';
import {EncryptedWalletHandler} from '../../../src/core/services/EncryptedWalletHandler';
import {EmailConfirmationHandler} from '../../../src/core/services/EmailConfirmationHandler';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';
import {FutureWalletStore} from '../../../src/integration/sql/services/FutureWalletStore';

const mockEmailService = (cb: any): any => ({
  sendConfirmationMail: (email: string, code: string) => new Promise((resolve) => {
    cb(code);
    resolve();
  }),
});

describe('INT: RestoreWalletHandler', () => {
  let knex: Knex;
  let restoreWalletHandler: RestoreWalletHandler;
  let storedEncryptedWallet: StoredEncryptedWallet;
  let encryptedWalletHandler: EncryptedWalletHandler;
  let emailConfirmationHandler: EmailConfirmationHandler;
  let sentCode: string;

  beforeEach(async () => {
    knex = getKnexConfig();
    const emailConfirmationsStore = new EmailConfirmationsStore(knex);
    const encryptedWalletsStore = new EncryptedWalletsStore(knex);
    const validator = new EmailConfirmationValidator();
    emailConfirmationHandler = new EmailConfirmationHandler(emailConfirmationsStore, mockEmailService((code: string) => {sentCode = code;}), validator, encryptedWalletsStore);
    encryptedWalletHandler = new EncryptedWalletHandler(emailConfirmationsStore, validator, encryptedWalletsStore);
    const futureWalletStore = new FutureWalletStore(knex);
    await futureWalletStore.add(TEST_STORED_FUTURE_WALLET);
    restoreWalletHandler = new RestoreWalletHandler(emailConfirmationsStore, validator, encryptedWalletsStore, futureWalletStore);
  });

  it('restore wallet roundtrip', async () => {
    await emailConfirmationHandler.requestCreating(TEST_EMAIL, TEST_ENS_NAME);
    storedEncryptedWallet = {
      email: TEST_EMAIL,
      ensName: TEST_ENS_NAME,
      walletJSON: TEST_WALLET.encryptedWallet,
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_WALLET.address,
    };
    await emailConfirmationHandler.confirm(TEST_EMAIL, sentCode);
    await encryptedWalletHandler.handle(storedEncryptedWallet, sentCode);
    await emailConfirmationHandler.requestRestore(TEST_EMAIL);
    const result = await restoreWalletHandler.handle(TEST_EMAIL, sentCode);
    const {gasToken, gasPrice} = TEST_STORED_FUTURE_WALLET;
    expect(result).deep.eq({...storedEncryptedWallet, gasPrice, gasToken});
  });

  it('negative scenario of restoring wallet', async () => {
    await emailConfirmationHandler.requestCreating(TEST_EMAIL, TEST_ENS_NAME);
    storedEncryptedWallet = {
      email: TEST_EMAIL,
      ensName: TEST_ENS_NAME,
      walletJSON: TEST_WALLET.encryptedWallet,
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_WALLET.address,
    };
    await emailConfirmationHandler.confirm(TEST_EMAIL, sentCode);
    await encryptedWalletHandler.handle(storedEncryptedWallet, sentCode);
    await emailConfirmationHandler.requestRestore(TEST_EMAIL);
    await expect(restoreWalletHandler.handle(TEST_EMAIL, '000000')).to.be.rejectedWith('Invalid code');
  });

  afterEach(async () => {
    await clearDatabase(knex);
    await knex.destroy();
  });
});
