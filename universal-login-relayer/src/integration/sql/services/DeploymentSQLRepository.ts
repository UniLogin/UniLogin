import Deployment from '../../../core/models/Deployment';
import SQLRepository from './SQLRepository';
import Knex from 'knex';
import {ensureProperTransactionHash} from '../../../core/utils/validations';

export class DeploymentSQLRepository extends SQLRepository<Deployment> {
  constructor(knex: Knex) {
    super(knex, 'deployments');
  }

  // Override
  async markAsPending(hash: string, transactionHash: string, gasPriceUsed: string) {
    ensureProperTransactionHash(transactionHash);
    await this.knex(this.tableName)
      .where('hash', hash)
      .update({transactionHash, gasPriceUsed})
      .update('state', 'Pending');
  }

  async markAsSuccess(hash: string, gasUsed: string) {
    await this.knex(this.tableName)
      .where('hash', hash)
      .update('gasUsed', gasUsed)
      .update('state', 'Success');
  }
}
