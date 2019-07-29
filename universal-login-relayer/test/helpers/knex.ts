import knex from 'knex';
import {getConfig} from '../../lib';

export const getTestKnexConfig = () => getConfig('test').database;

export const getKnex = () => knex(getConfig('test').database);

export default getKnex;
