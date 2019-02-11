const {join, dirname} = require('path');

function getMigrationPath() {
  const packagePath = require.resolve('universal-login-relayer/package.json');
  return join(dirname(packagePath), 'migrations');
}

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_development',
      user:     'postgres',
      password: 'postgres',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: getMigrationPath(),
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_test',
      user:     'postgres',
      password: 'postgres',
    },
    migrations: {
      directory: getMigrationPath(),
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
  },

};

