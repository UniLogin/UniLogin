import ethers from 'ethers';
import Relayer from '../lib/relayer/relayer';

require('dotenv').config();
const config = require('../config/relayer');
const provider = new ethers.providers.JsonRpcProvider(config.jsonRpcUrl, config.chainSpec);
const relayer = new Relayer(provider, config);
relayer.start();
