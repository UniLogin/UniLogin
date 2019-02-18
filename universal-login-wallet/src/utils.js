import devConfig from '../config/dev-config';
import prodConfig from '../config/prod-config';

function getConfig() {
  if(process.env.NODE_ENV === 'production') {
    return prodConfig;
  }
  return devConfig;
}

export {getConfig};