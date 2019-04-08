import {TokenGrantingRelayer} from '@universal-login/relayer';
require('dotenv').config();

const config = require('./config');

const relayer = new TokenGrantingRelayer(config);
relayer.start().catch(console.error);
