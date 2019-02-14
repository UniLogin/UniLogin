import knex from 'knex';
import knexConfig from '../config/knexfile';

const getNodeEnv = () => process.env.NODE_ENV || 'development';

const getKnexConfig = () => knexConfig[getNodeEnv()];

const getKnex = () => knex(getKnexConfig());

class PostgreDB {
  constructor() {
    this.knex = getKnex();
  }

  // Default methods
  async addRequest(identityAddress, key, deviceInfo) {
    return this.knex.database.insert({identityAddress, key, deviceInfo})
      .into('authorisations')
      .returning('id');
  }
  
  async getPendingAuthorisations(identityAddress) {
    return await this.knex.database('authorisations')
      .where({identityAddress})
      .select();
  }
  
  async removeRequest(identityAddress, key) {
    await this.knex.database('authorisations')
      .where('identityAddress', identityAddress)
      .where('key', key)
      .del();
  }

  onStart() {
    this.knex.migrate.latest();
  }

  onStop() {
    this.knex.destroy();
  }

  getKnex() {
    return this.knex;
  }
}

export {getNodeEnv, getKnexConfig, getKnex, PostgreDB}
