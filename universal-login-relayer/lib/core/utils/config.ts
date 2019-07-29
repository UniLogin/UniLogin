import {getEnv} from '@universal-login/commons';
import devConfig from '../../config/config.dev';
import prodConfig from '../../config/config.prod';

export const getNodeEnv = () => getEnv('NODE_ENV', 'development');

export function getConfig(environment: string = getNodeEnv()) {
  switch (environment) {
    case 'production':
      return prodConfig;
    case 'development':
    default:
      return devConfig;
  }
}
