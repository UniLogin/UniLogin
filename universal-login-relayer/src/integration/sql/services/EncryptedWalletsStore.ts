import Knex from 'knex';
import {EncryptedWallet} from '@unilogin/commons';

export class EncryptedWalletsStore {
  private tableName = 'encrypted_wallets';

  constructor(private database: Knex) {
  }

  async add(encryptedWallet: EncryptedWallet) {
    return (await this.database(this.tableName)
      .insert(encryptedWallet)
      .returning('email'))[0];
  }

  async get(email: string): Promise<EncryptedWallet> {
    return this.database(this.tableName)
      .select(['walletJSON', 'email', 'ensName'])
      .where('email', email)
      .first();
  }
}
