import knex from 'knex';
import {getConfig} from '../../lib';

export const getKnexConfig = () => knex(getConfig('test').database);

export default getKnexConfig;
