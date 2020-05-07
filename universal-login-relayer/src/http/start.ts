import Relayer from './relayers/Relayer';
import {getConfig} from '../core/utils/config';
import {NodeEnv, asNodeEnv, getEnv} from '@unilogin/commons';
import {cast} from '@restless/sanitizers';

export const start = (nodeEnv: NodeEnv) => {
  const config = getConfig(nodeEnv);
  const relayer = new Relayer(config);
  relayer.start().then(
    () => console.log(`Server listening on port ${config.port}`),
    console.error,
  );
};

const nodeEnv = cast(getEnv('NODE_ENV'), asNodeEnv);

start(nodeEnv);
