import TokenGrantingRelayer from './TokenGrantingRelayer';
import knex from 'knex';
import path from 'path';
require('dotenv').config();
const config = require('./config');

const db = knex({
  client: 'postgresql',
  connection: {
    database: 'universal_login_relayer_test',
    user:     'postgres',
    password: ''
  },
  migrations: {
    directory: path.join(__dirname, '../../../universal-login-relayer/migrations'),
    tableName: 'knex_migrations'
  }
});

const relayer = new TokenGrantingRelayer(config, '', db);
relayer.addHooks();
relayer.start();
