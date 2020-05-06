import {getEnv, asNetwork} from '@unilogin/commons';
import {cast} from '@restless/sanitizers';
import {start} from './start';

const network = cast(getEnv('NETWORK', 'mainnet'), asNetwork);

start(network);
