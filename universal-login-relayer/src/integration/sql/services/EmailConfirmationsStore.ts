import Knex from 'knex';
import {EmailConfirmation} from '@unilogin/commons'

export class EmailConfirmationsStore {
  private tableName = 'email_confirmations';

  constructor (private database: Knex) {
  }

  add(email: string, ensName: string, code: string) {
    return this.database
      .insert({email, ensName, code})
      .into(this.tableName)
      .returning('email');
  }

  async get(email: string): Promise<EmailConfirmation>{
    return this.database
      .select(['email', 'ensName', 'code', 'isConfirmed'])
      .from(this.tableName)
      .where('email', email)
      .orderBy('created_at', 'desc')
      .first();
  }
}