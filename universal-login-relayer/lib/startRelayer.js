import Relayer from './relayer';
import knex from 'knex';
import knexConfig from '../knexfile';
require('dotenv').config();

const config = require('./config/relayer');

const database = knex(knexConfig[`${process.env.NODE_ENV}`]);

const relayer = new Relayer(config, '' , database);
relayer.start();
