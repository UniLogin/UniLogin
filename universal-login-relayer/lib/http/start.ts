import Relayer from './relayers/Relayer';
import {getConfig} from '../core/utils/config';
import {getEnv} from '@universal-login/commons';

export const start = (nodeEnv: string) => {
  const config = getConfig(nodeEnv);
  const relayer = new Relayer(config);
  relayer.start().then(
    () => console.log(`Server listening on port ${config.port}`),
    console.error
  );
};

start(getEnv('NODE_ENV', 'production'));
