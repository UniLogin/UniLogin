import {expect} from 'chai';
import {StoredEncryptedWallet, TEST_CONTRACT_ADDRESS, TEST_WALLET} from '@unilogin/commons';
import {getKnexConfig} from '../../testhelpers/knex';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';

describe('INT: EncryptedWalletsStore', () => {
  const knex = getKnexConfig();
  const encryptedWalletsStore = new EncryptedWalletsStore(knex);
  const exampleEmail = 'encryptedWallet@email.com';
  const exampleEnsName = 'bob.unilogin.eth';
  const encryptedWallet: StoredEncryptedWallet = {
    walletJSON: TEST_WALLET.encryptedWallet,
    email: exampleEmail,
    ensName: exampleEnsName,
    contractAddress: TEST_CONTRACT_ADDRESS,
    publicKey: TEST_WALLET.address,
  };

  it('Should add encryptedWallet to database and get it from it by email and ensName', async () => {
    const email = await encryptedWalletsStore.add(encryptedWallet);
    expect(email).be.deep.eq(exampleEmail);
    expect(await encryptedWalletsStore.get(email)).be.deep.eq(encryptedWallet);
    expect(await encryptedWalletsStore.get(exampleEnsName)).be.deep.eq(encryptedWallet);
  });

  it('exists', async () => {
    await encryptedWalletsStore.add(encryptedWallet);
    expect(await encryptedWalletsStore.exists('not@exist.email', exampleEnsName)).to.be.true;
    expect(await encryptedWalletsStore.exists(exampleEmail, 'not.exist.ens')).to.be.true;
    expect(await encryptedWalletsStore.exists('not@exist.email', 'not.exist.ens')).to.be.false;
  });

  it('Should fail when adding duplicated email', async () => {
    const exampleEmail = 'encryptedWallet2@email.com';
    const storedEncryptedWallet: StoredEncryptedWallet = {
      walletJSON: TEST_WALLET.encryptedWallet,
      email: exampleEmail,
      ensName: 'bob2.unilogin.eth',
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_WALLET.address,
    };

    const email = await encryptedWalletsStore.add(storedEncryptedWallet);
    expect(email).be.deep.eq(exampleEmail);
    await expect(encryptedWalletsStore.add(storedEncryptedWallet)).to.be.rejectedWith('duplicate key value violates unique constraint "encrypted_wallets_email_unique"');
  });

  afterEach(async () => {
    await knex('encrypted_wallets').del();
  });

  after(async () => {
    await knex.destroy();
  });
});
