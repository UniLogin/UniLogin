import {asEnum, cast} from '@restless/sanitizers';
import {getEnv} from '../utils/getEnv';

export type NodeEnv = 'development' | 'test' | 'production';

export const asNodeEnv = asEnum<NodeEnv>(['development', 'test', 'production'], 'NodeEnv');

export const getNodeEnv = (defaultEnv?: NodeEnv) => cast(getEnv('NODE_ENV', defaultEnv || 'development'), asNodeEnv);
