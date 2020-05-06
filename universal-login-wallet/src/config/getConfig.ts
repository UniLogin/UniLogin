import {getNodeEnv} from '@unilogin/commons';
import config from './config';

const getConfig = () => config[getNodeEnv()];

export default getConfig;
