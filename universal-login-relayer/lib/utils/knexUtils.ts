import knex from 'knex';
import knexConfig from '../config/knexfile';

type ProcessEnv = 'development' | 'test' | 'production';

const getNodeEnv = () => process.env.NODE_ENV || 'development';

const getKnexConfig = () => knexConfig[getNodeEnv() as ProcessEnv];

const getKnex = () => knex(getKnexConfig());

export {getNodeEnv, getKnexConfig, getKnex};
