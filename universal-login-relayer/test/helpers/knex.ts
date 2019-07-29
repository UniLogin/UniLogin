import knex from 'knex';
import {getConfig} from '../../lib';

export const getKnex = () => knex(getConfig('test').database);

export default getKnex;
