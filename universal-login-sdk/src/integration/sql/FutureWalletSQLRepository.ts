import Knex from 'knex';
import {FutureWallet} from '../..';

export class FutureWalletSQLRepository{
  tableName: string;
  constructor(public knex: Knex) {
    this.tableName = 'future_wallets';
  }

  async add(contractAddress: string, futureWallet: FutureWallet) {
    await this.knex
      .insert({
        contractAddress,
        publicKey: futureWallet.publicKey,
        gasPrice: futureWallet.gasPrice,
        ensName: futureWallet.ensName,
        gasToken: futureWallet.gasToken,
        created_at: this.knex.fn.now(),
      })
      .into(this.tableName);
  }

  async get(contractAddress: string) {
    return await this.getFutureWallet(contractAddress);
  }

  private async getFutureWallet(contractAddress: string) {
    return this.knex(this.tableName)
      .where('contractAddress', contractAddress)
      .columns('publicKey', 'gasPrice', 'ensName', 'gasToken')
      .first();
  }

  async isPresent(contractAddress: string) {
    const futureWallet = await this.getFutureWallet(contractAddress);
    return !!futureWallet;
  }

  async remove(contractAddress: string) {
    const futureWallet: FutureWallet = await this.get(contractAddress);
    await this.knex(this.tableName)
      .delete()
      .where('contractAddress', contractAddress);
    return futureWallet;
  }
}

export default FutureWalletSQLRepository;