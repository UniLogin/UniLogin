import TokenGrantingRelayer from './TokenGrantingRelayer';
require('dotenv').config();

const config = require('./config');

const relayer = new TokenGrantingRelayer(config);
relayer.start();
relayer.addHooks();
