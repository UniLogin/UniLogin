import path from 'path';
import { KnexConfig } from './KnexConfig';
import { getEnv } from './getEnv';

function getMigrationDir() {
  const dir1 = path.join(__dirname, '../../../migrations');
  // THIS IS ONLY NEEDED BECAUSE SDK IMPORTS FROM LIB DIRECTLY
  const dir2 = path.join(__dirname, '../../migrations');
  return dir1.includes('universal-login-relayer') ? dir1 : dir2;
}

const migrationDir = getMigrationDir();

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
      directory: migrationDir,
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
