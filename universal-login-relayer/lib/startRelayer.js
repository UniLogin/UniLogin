import Relayer from './relayer';
require('dotenv').config();

const config = require('./config/relayer');

const relayer = new Relayer(config, '');
relayer.start();
