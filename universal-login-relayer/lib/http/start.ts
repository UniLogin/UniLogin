require('dotenv').config();
import Relayer from './relayers/Relayer';
import {getConfig} from '../core/utils/config';

const config = getConfig();
const relayer = new Relayer(config);
relayer.start().then(
  () => console.log(`Server listening on port ${config.port}`),
  console.error
);
