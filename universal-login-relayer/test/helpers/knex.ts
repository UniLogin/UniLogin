import knex from 'knex';
import {join} from 'path';

const testKnexConfig = {
  client: 'postgresql',
  connection: {
    database: 'universal_login_relayer_test',
    user: 'postgres',
    password: 'postgres',
  },
  migrations: {
    directory: join(__dirname, '../../lib/integration/sql/migrations'),
  }
};

export const getTestKnexConfig = () => testKnexConfig;

export const getKnex = () => knex(testKnexConfig);

export default getKnex;
