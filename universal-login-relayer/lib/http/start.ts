require('dotenv').config();
import Relayer from './relayers/Relayer';
import config from '../config/relayer';

const relayer = new Relayer(config);
relayer.start().then(
  () => console.log(`Server listening on port ${config.port}`),
  console.error
);
