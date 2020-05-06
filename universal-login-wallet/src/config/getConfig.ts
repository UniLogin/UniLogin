import {getNodeEnv} from '@unilogin/commons';
import config from './config';

const getConfig = () => config[getNodeEnv('production')];

export default getConfig;
