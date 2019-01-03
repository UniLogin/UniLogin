require('dotenv').config();
import Relayer from '../lib/relayer';
import knex from 'knex';
import knexConfig from '../knexConfig';

const config = require('../lib/config/relayer');
const db = knex(knexConfig[`${process.env.NODE_ENV}`]);

const relayer = new Relayer(config, '', db);
relayer.start();
