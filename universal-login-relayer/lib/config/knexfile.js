const path = require('path');

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
      directory: path.join(__dirname, '../../migrations'),
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
      directory: path.join(__dirname, '../../migrations'),
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
  },

};
