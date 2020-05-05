import {getEnv, asNetwork} from '@unilogin/commons';
import {cast} from '@restless/sanitizers';
import {start} from '../src';

const network = cast(getEnv('NETWORK', 'mainnet'), asNetwork);

start(network);
