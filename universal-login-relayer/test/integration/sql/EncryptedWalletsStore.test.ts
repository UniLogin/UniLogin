import {expect} from 'chai';
import {EncryptedWallet, TEST_ENCRYPTED_WALLET_JSON} from '@unilogin/commons';
import {getKnexConfig} from '../../testhelpers/knex';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';

describe('UNIT: EncryptedWalletsStore', () => {
  const knex = getKnexConfig();
  const encryptedWalletsStore = new EncryptedWalletsStore(knex);

  it('Should add encryptedWallet to database and get it from it', async () => {
    const exampleEmail = 'encryptedWallet@email.com';
    const encryptedWallets: EncryptedWallet = {
      walletJSON: TEST_ENCRYPTED_WALLET_JSON,
      email: exampleEmail,
      ensName: 'bob.unilogin.eth',
    };

    const email = await encryptedWalletsStore.add(encryptedWallets);
    expect(email).be.deep.eq(exampleEmail);
    expect(await encryptedWalletsStore.get(email)).be.deep.eq(encryptedWallets);
  });
});
