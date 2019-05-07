import knex from 'knex';
import { getEnv } from '../config/getEnv';
import { getKnexConfig as getConfig } from '../config/knexfile';

const environment = getEnv('NODE_ENV', 'development');

const getNodeEnv = () => environment;

const getKnexConfig = () => getConfig(environment);

const getKnex = () => knex(getKnexConfig());

export {getNodeEnv, getKnexConfig, getKnex};

