import Relayer from './relayers/Relayer';
import {getConfig} from '../core/utils/config';
import {NodeEnv, getNodeEnv} from '@unilogin/commons';

export const start = (nodeEnv: NodeEnv) => {
  const config = getConfig(nodeEnv);
  const relayer = new Relayer(config);
  relayer.start().then(
    () => console.log(`Server listening on port ${config.port}`),
    console.error,
  );
};

start(getNodeEnv('production'));
