import Knex from 'knex';
import {EmailConfirmation} from '@unilogin/commons';

export class EmailConfirmationsStore {
  private tableName = 'email_confirmations';

  constructor(private database: Knex) {
  }

  add(emailConfirmation: EmailConfirmation) {
    const {createdAt, ...rest} = emailConfirmation;
    return this.database(this.tableName)
      .insert({...rest, created_at: createdAt})
      .returning('email');
  }

  async get(email: string): Promise<EmailConfirmation> {
    const {created_at, ...rest} = await this.database(this.tableName)
      .select(['email', 'ensName', 'code', 'created_at', 'isConfirmed'])
      .where('email', email)
      .orderBy('created_at', 'desc')
      .first();
    return {...rest, createdAt: created_at};
  }
}
