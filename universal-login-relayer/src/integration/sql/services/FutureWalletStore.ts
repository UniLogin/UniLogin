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

  get(contractAddress: string) {
    return this.database
      .select(['contractAddress', 'ensName', 'gasPrice', 'gasToken', 'publicKey', 'tokenPriceInETH'])
      .from('future_wallets')
      .where('contractAddress', contractAddress)
      .first();
  }

  getByEnsName(ensName: string) {
    return this.database
      .select(['contractAddress', 'ensName', 'gasPrice', 'gasToken', 'publicKey', 'tokenPriceInETH'])
      .from('future_wallets')
      .where({ensName})
      .first();
  }
}
