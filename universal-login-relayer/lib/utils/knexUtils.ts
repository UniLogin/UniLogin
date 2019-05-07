import knex from 'knex';
import { getEnv } from '../config/getEnv';
import { getKnexConfig as getConfig } from '../config/knexfile';

const getNodeEnv = () => getEnv('NODE_ENV', 'development');

const getKnexConfig = () => getConfig(getNodeEnv());

const getKnex = () => knex(getKnexConfig());

export {getNodeEnv, getKnexConfig, getKnex};

