import Knex from 'knex';
import {EmailConfirmation} from '@unilogin/commons';

export class EmailConfirmationsStore {
  private tableName = 'email_confirmations';

  constructor(private database: Knex) {
  }

  add(emailConfirmation: EmailConfirmation) {
    return this.database
      .insert(emailConfirmation)
      .into(this.tableName)
      .returning('email');
  }

  async get(email: string): Promise<EmailConfirmation> {
    return this.database
      .select(['email', 'ensName', 'code', 'created_at', 'isConfirmed'])
      .from(this.tableName)
      .where('email', email)
      .orderBy('created_at', 'desc')
      .first();
  }
}
