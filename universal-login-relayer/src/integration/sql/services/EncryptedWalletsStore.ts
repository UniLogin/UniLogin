import Knex from 'knex';
import {StoredEncryptedWallet} from '@unilogin/commons';

export class EncryptedWalletsStore {
  private tableName = 'encrypted_wallets';

  constructor(private database: Knex) {
  }

  async add(storedEncryptedWallet: StoredEncryptedWallet) {
    const {walletJSON, ...rest} = storedEncryptedWallet;
    return (await this.database(this.tableName)
      .insert({...rest, walletJSON: JSON.stringify(walletJSON)})
      .returning('email'))[0];
  }

  async get(emailOrEnsName: string): Promise<StoredEncryptedWallet> {
    const storedEncryptedWallet = await this.database(this.tableName)
      .select(['email', 'ensName', 'walletJSON', 'contractAddress'])
      .where('email', emailOrEnsName)
      .orWhere('ensName', emailOrEnsName)
      .first();
    storedEncryptedWallet.walletJSON = JSON.parse(storedEncryptedWallet.walletJSON);
    return storedEncryptedWallet;
  }
}
