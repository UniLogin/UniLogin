const knex = require('knex');
const {join, dirname} = require('path');

function getMigrationPath() {
  const packagePath = require.resolve('universal-login-relayer/package.json');
  return join(dirname(packagePath), 'migrations');
}

const getKnex = () => knex({
  client: 'postgresql',
  connection: {
    database: 'universal_login_relayer_test',
    user:     'postgres',
    password: 'postgres',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: getMigrationPath(),
  },
});

module.exports = {getKnex};
