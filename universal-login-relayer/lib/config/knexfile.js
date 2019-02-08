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
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_test',
      user:     'postgres',
      password: 'postgres',
    },
    migrations: {},
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
  },

};
