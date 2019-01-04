import TokenGrantingRelayer from './TokenGrantingRelayer';
import {getKnex} from './utils';
require('dotenv').config();

const config = require('./config');
const db = getKnex();

const relayer = new TokenGrantingRelayer(config, '', db);
relayer.addHooks();
relayer.start();
