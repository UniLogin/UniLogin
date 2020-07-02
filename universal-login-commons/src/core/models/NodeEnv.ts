import {asEnum} from '@restless/sanitizers';

export type NodeEnv = 'development' | 'test' | 'production';

export const asNodeEnv = asEnum<NodeEnv>(['development', 'test', 'production'], 'NodeEnv');
