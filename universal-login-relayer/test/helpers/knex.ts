import knex from 'knex';
import {getConfig} from '../../src';

export const getKnexConfig = () => knex(getConfig('test').database);

export default getKnexConfig;
