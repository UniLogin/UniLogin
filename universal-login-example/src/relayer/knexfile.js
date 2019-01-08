import path from 'path';

export default {

  development: {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_development',
      user:     'postgres',
      password: 'postgres'
    },
    migrations: {
      directory: path.join(__dirname, '../../../node_modules/universal-login-relayer/migrations')
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
      directory: path.join(__dirname, '../../../node_modules/universal-login-relayer/migrations')
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '../../../node_modules/universal-login-relayer/migrations'),
      tableName: 'knex_migrations'
    }
  }

};
