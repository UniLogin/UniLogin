import {asNodeEnv} from '@unilogin/commons';
import config from './config';
import {cast} from '@restless/sanitizers';

const getConfig = () => config[cast(process.env.NODE_ENV, asNodeEnv)];

export default getConfig;
