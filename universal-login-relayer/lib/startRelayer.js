import Relayer from './relayer';
import {PostgreDB} from './utils/postgreDB';
require('dotenv').config();

const config = require('./config/relayer');

const db = new PostgreDB();
const relayer = new Relayer(config, db);
relayer.start();
