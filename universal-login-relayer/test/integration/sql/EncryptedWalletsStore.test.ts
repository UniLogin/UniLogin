import {expect} from 'chai';
import {StoredEncryptedWallet, TEST_ENCRYPTED_WALLET_JSON} from '@unilogin/commons';
import {getKnexConfig} from '../../testhelpers/knex';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';

describe('INT: EncryptedWalletsStore', () => {
  const knex = getKnexConfig();
  const encryptedWalletsStore = new EncryptedWalletsStore(knex);

  it('Should add encryptedWallet to database and get it from it by email and ensName', async () => {
    const exampleEmail = 'encryptedWallet@email.com';
    const exampleEnsName = 'bob.unilogin.eth';
    const encryptedWallet: StoredEncryptedWallet = {
      walletJSON: TEST_ENCRYPTED_WALLET_JSON,
      email: exampleEmail,
      ensName: exampleEnsName,
    };

    const email = await encryptedWalletsStore.add(encryptedWallet);
    expect(email).be.deep.eq(exampleEmail);
    expect(await encryptedWalletsStore.get(email)).be.deep.eq(encryptedWallet);
    expect(await encryptedWalletsStore.get(exampleEnsName)).be.deep.eq(encryptedWallet);
  });

  it('Should fail when adding duplicated email', async () => {
    const exampleEmail = 'encryptedWallet2@email.com';
    const storedEncryptedWallet: StoredEncryptedWallet = {
      walletJSON: TEST_ENCRYPTED_WALLET_JSON,
      email: exampleEmail,
      ensName: 'bob2.unilogin.eth',
    };

    const email = await encryptedWalletsStore.add(storedEncryptedWallet);
    expect(email).be.deep.eq(exampleEmail);
    await expect(encryptedWalletsStore.add(storedEncryptedWallet)).to.be.rejectedWith('duplicate key value violates unique constraint "encrypted_wallets_email_unique"');
  });

  after(async () => {
    await knex.destroy();
  });
});
