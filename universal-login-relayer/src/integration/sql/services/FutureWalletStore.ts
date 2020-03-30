import Knex from 'knex';
import {StoredFutureWallet} from '@unilogin/commons';

export class FutureWalletStore {
  constructor(private database: Knex) {}

  add(futureWallet: StoredFutureWallet) {
    return this.database
      .insert(futureWallet)
      .into('future_wallets')
      .returning('contractAddress');
  }
}
