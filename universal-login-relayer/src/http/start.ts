import Relayer from './relayers/Relayer';
import {Network, getEnv, asNetwork} from '@unilogin/commons';
import {getConfigForNetwork} from '../config/config';
import {cast} from '@restless/sanitizers';

export const start = (network: Network) => {
  console.log({network});
  const config = getConfigForNetwork(network);
  const relayer = new Relayer(config);
  relayer.start().then(
    () => console.log(`Server listening on port ${config.port}`),
    console.error,
  );
};

start(cast(getEnv('NETWORK', 'mainnet'), asNetwork));
