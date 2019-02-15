import knex from 'knex';
import knexConfig from './knexfile';

const getNodeEnv = () => process.env.NODE_ENV || 'development';

const getKnexConfig = () => knexConfig[getNodeEnv()];

const getKnex = () => knex(getKnexConfig());

const getKnexWithoutDatabase = () => {
  const config = getKnexConfig();
  const newConfig = {...config, connection: {...config.connection, database: 'postgres'}};
  return knex(newConfig);
};

export {getKnex, getKnexConfig, getKnexWithoutDatabase};
