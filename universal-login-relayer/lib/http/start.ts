require('dotenv').config();
import Relayer from './relayers/Relayer';
import {getConfig} from '../config/relayer';

const relayer = new Relayer(getConfig());
relayer.start().then(
  () => console.log(`Server listening on port ${config.port}`),
  console.error
);
