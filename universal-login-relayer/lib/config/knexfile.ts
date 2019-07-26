import path from 'path';
import {getEnv} from '@universal-login/commons';
import {KnexConfig} from './KnexConfig';

const migrationDir = path.join(__dirname, '../integration/sql/migrations');

function getDevelopmentKnexConfig(): KnexConfig {
  return {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_development',
      user: 'postgres',
      password: 'postgres',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationDir,
    },
  };
}

function getTestKnexConfig(): KnexConfig {
  return {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_test',
      user: 'postgres',
      password: 'postgres',
    },
    migrations: {
      directory: migrationDir,
    }
  };
}

function getProductionKnexConfig(): KnexConfig {
  return {
    client: 'postgresql',
    connection: getEnv('DATABASE_URL'),
    migrations: {
      directory: migrationDir,
    }
  };
}

export function getKnexConfig(environment: string) {
  switch (environment) {
    case 'production':
      return getProductionKnexConfig();
    case 'test':
      return getTestKnexConfig();
    case 'development':
    default:
      return getDevelopmentKnexConfig();
  }
}
