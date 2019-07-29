import {getEnv} from '@universal-login/commons';
import testConfig from '../../config/config.test';
import devConfig from '../../config/config.dev';
import prodConfig from '../../config/config.prod';

const getNodeEnv = () => getEnv('NODE_ENV', 'development');

export function getConfig(environment: string = getNodeEnv()) {
  switch (environment) {
    case 'production':
      return prodConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return devConfig;
  }
}
