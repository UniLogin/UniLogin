import Relayer from '../lib/relayer';
import {getKnex} from '../lib/utils/knexUtils';
require('dotenv').config();

const config = require('../lib/config/relayer');
const db = getKnex();

const relayer = new Relayer(config, '', db);
relayer.start();
