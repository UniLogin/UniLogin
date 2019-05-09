require('dotenv').config();
import Relayer from './relayer';
import config from './config/relayer';

const relayer = new Relayer(config);
relayer.start().then(
  () => console.log('Started'),
  console.error
);
