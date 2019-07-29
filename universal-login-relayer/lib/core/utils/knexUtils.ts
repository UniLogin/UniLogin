import knex from 'knex';
import {getConfig} from './config';

const getKnex = () => knex(getConfig().database);

export {getKnex};

