import Relayer from './relayer';
import {getKnex} from './utils/knexUtils';
require('dotenv').config();

const config = require('./config/relayer');
const database = getKnex();

const relayer = new Relayer(config, database, '');
relayer.start();
