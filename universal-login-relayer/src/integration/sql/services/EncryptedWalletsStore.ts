import Knex from 'knex';
import {StoredEncryptedWallet, ensureNotNullish} from '@unilogin/commons';
import {StoredEncryptedWalletNotFound} from '../../../core/utils/errors';

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
      .select(['email', 'ensName', 'walletJSON', 'contractAddress', 'publicKey'])
      .where('email', emailOrEnsName)
      .orWhere('ensName', emailOrEnsName)
      .first();
    ensureNotNullish(storedEncryptedWallet, StoredEncryptedWalletNotFound, emailOrEnsName);
    storedEncryptedWallet.walletJSON = JSON.parse(storedEncryptedWallet.walletJSON);
    return storedEncryptedWallet;
  }

  async exists(email: string, ensName: string) {
    return !!(await this.database(this.tableName)
      .select()
      .where({email})
      .orWhere({ensName})
      .first());
  };
}
