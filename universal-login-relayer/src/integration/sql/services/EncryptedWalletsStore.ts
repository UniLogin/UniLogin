import Knex from 'knex';
import {EncryptedWallet} from '@unilogin/commons';

export class EncryptedWalletsStore {
  private tableName = 'encrypted_wallets';

  constructor(private database: Knex) {
  }

  async add(encryptedWallet: EncryptedWallet) {
    const {walletJSON, ...rest} = encryptedWallet;
    return (await this.database(this.tableName)
      .insert({...rest, walletJSON: JSON.stringify(walletJSON)})
      .returning('email'))[0];
  }

  async get(email: string): Promise<EncryptedWallet> {
    const encryptedWallet = await this.database(this.tableName)
      .select(['email', 'ensName', 'walletJSON'])
      .where('email', email)
      .first();
    encryptedWallet.walletJSON = JSON.parse(encryptedWallet.walletJSON);
    return encryptedWallet;
  }
}
