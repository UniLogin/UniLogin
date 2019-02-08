import knex from 'knex';
import knexConfig from '../config/knexfile';

const getNodeEnv = () => process.env.NODE_ENV || 'development';

const getKnexConfig = () => knexConfig[getNodeEnv()];

const getKnex = () => knex(getKnexConfig());

export {getNodeEnv, getKnexConfig, getKnex};
