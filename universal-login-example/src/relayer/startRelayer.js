import {TokenGrantingRelayer} from 'universal-login-ops';
import {PostgreDB} from 'universal-login-relayer/build/utils/postgreDB';
require('dotenv').config();

const config = require('./config');

var database = new PostgreDB();
const relayer = new TokenGrantingRelayer(config, database);
relayer.start().catch(console.error);
