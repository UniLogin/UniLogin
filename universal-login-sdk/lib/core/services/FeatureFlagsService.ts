import {ensure, stringToEnumKey, getEnumKeys} from '@universal-login/commons';
import {UnexpectedError} from '../utils/errors';
import {Feature} from '../models/Feature';

export class FeatureFlagsService {

  private feature: Record<Feature, boolean> = {} as any;

  enableAll(featuresList: string[]) {
    featuresList.forEach((feature) => this.enable(feature));
  }

  enable(feature: Feature | string) {
    if (typeof feature === 'string') {
      ensure(this.isFeature(feature), UnexpectedError, 'Invalid feature');
      return this.feature[stringToEnumKey(Feature, feature) as Feature] = true;
    }
    this.feature[feature] = true;
  }

  isFeature(name: string) {
    return getEnumKeys(Feature).includes(name);
  }

  isEnabled(feature: Feature | string) {
    if (typeof feature === 'string') {
      ensure(this.isFeature(feature), UnexpectedError, 'Invalid feature');
      return this.feature[stringToEnumKey(Feature, feature) as Feature] || false;
    }
    return this.feature[feature] || false;
  }
}
