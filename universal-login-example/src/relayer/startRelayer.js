import TokenGrantingRelayer from 'universal-login-ops';
import {getKnex} from './utils';
require('dotenv').config();

const config = require('./config');
const db = getKnex();

const relayer = new TokenGrantingRelayer(config, db, '');
relayer.start();
