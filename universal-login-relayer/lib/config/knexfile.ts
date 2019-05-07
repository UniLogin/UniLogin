import path from 'path';
import { KnexConfig } from './KnexConfig';
import { getEnv } from './getEnv';

function getDevelopmentKnexConfig(): KnexConfig {
  return {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_development',
      user:     'postgres',
      password: 'postgres',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  };
}

function getTestKnexConfig(): KnexConfig {
  return {
    client: 'postgresql',
    connection: {
      database: 'universal_login_relayer_test',
      user:     'postgres',
      password: 'postgres',
    }
  };
}

function getProductionKnexConfig(): KnexConfig {
  return {
    client: 'postgresql',
    connection: getEnv('DATABASE_URL')
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
