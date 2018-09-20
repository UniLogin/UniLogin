import ethers from 'ethers';
import Relayer from '../lib//relayer';

require('dotenv').config();
const config = require('../lib/config/relayer');
const provider = new ethers.providers.JsonRpcProvider(config.jsonRpcUrl, config.chainSpec);
const relayer = new Relayer(provider, config);
relayer.start();
