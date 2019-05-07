require('dotenv').config();
import Relayer from './relayer';
import config from './config/relayer';

const relayer = new Relayer(config as any); // TODO: Types do not match for config! Fix this
relayer.start().then(
  () => console.log('Started'),
  console.error
);
