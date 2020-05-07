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

  getGasPriceInToken(contractAddress: string) {
    return this.database
      .first()
      .orderBy('created_at', 'asc')
      .column('tokenPriceInETH')
      .where('contractAddress', contractAddress)
      .select();
  }
}
