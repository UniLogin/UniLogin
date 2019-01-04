import path from 'path';
// Update with your config settings.

export default {

  development: {
    client: 'postgresql',
    connection: {
      database: 'universal-login-relayer-development',
      user:     'postgres',
      password: 'postgres'
    },
    migrations: {
      directory: path.join(__dirname, '../../../universal-login-relayer/migrations'),
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'universal-login-relayer-test',
      user:     'postgres',
      password: 'postgres'
    },
    migrations: {
      directory: path.join(__dirname, '../../../universal-login-relayer/migrations'),
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'universal-login-relayer-production',
      user:     process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
