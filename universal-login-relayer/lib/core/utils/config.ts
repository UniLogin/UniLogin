import prodConfig from '../../config/config.prod';
import testConfig from '../../config/config.test';
import {NodeEnvNotSpecified} from './errors';

export function getConfig(environment: string) {
  switch (environment) {
    case 'production':
      return prodConfig;
    case 'test':
      return testConfig;
    default:
      throw NodeEnvNotSpecified;
  }
}
