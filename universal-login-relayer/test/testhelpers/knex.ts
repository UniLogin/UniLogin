import knex from 'knex';
import {getConfigForNetwork} from '../../src/config/config';

export const getKnexConfig = () => knex(getConfigForNetwork('ganache').database);

export default getKnexConfig;
