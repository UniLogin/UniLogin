import Relayer from './relayers/Relayer';
import {Network} from '@unilogin/commons';
import {getConfigForNetwork} from '../config/config';

export const start = (network: Network) => {
  const config = getConfigForNetwork(network);
  const relayer = new Relayer(config);
  relayer.start().then(
    () => console.log(`Server listening on port ${config.port}`),
    console.error,
  );
};
