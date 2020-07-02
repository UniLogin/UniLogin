import {getEnv, asNetwork} from '@unilogin/commons';
import {cast} from '@restless/sanitizers';
import {start} from './start';

const network = cast(getEnv('CHAIN_NAME', 'mainnet'), asNetwork);

start(network);
