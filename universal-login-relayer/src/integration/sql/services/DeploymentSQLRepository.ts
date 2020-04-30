import Deployment from '../../../core/models/Deployment';
import SQLRepository from './SQLRepository';
import Knex from 'knex';

export class DeploymentSQLRepository extends SQLRepository<Deployment> {
  constructor(knex: Knex) {
    super(knex, 'deployments');
  }

  async markAsSuccess(hash: string, gasUsed: string) {
    await this.knex(this.tableName)
      .where('hash', hash)
      .update('gasUsed', gasUsed)
      .update('state', 'Success');
  }
}
