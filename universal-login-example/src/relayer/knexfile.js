import path from 'path';
// Update with your config settings.

export default {

  development: {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_development',
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
      database: 'universal_login_relayer_test',
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
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '../../../universal-login-relayer/migrations'),
      tableName: 'knex_migrations'
    }
  }

};
