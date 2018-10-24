require('dotenv').config();
import TokenGrantingRelayer from './TokenGrantingRelayer';
const config = require('./config');

const relayer = new TokenGrantingRelayer(config);
relayer.addHooks();
relayer.start();
