import {getKnexConfig} from '../../testhelpers/knex';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {EncryptedWallet} from '@unilogin/commons';
import {expect} from 'chai';

describe('UNIT: EncryptedWalletsStore', () => {
  const knex = getKnexConfig();
  const encryptedWalletsStore = new EncryptedWalletsStore(knex);

  it('Should add encryptedWallet to database and get it from it', async () => {
    const exampleEmail = 'encryptedWallet@email.com';
    const encryptedWallets: EncryptedWallet = {
      walletJSON: 'encryptedWalletJSON',
      email: exampleEmail,
      ensName: 'bob.unilogin.eth',
    };

    const email = await encryptedWalletsStore.add(encryptedWallets);
    expect(email).be.deep.eq(exampleEmail);
    expect(await encryptedWalletsStore.get(email)).be.deep.eq(encryptedWallets);
  });
});
