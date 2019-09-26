import {TopUpProvider} from '../models/TopUpProvider';
import {TopUpComponentType} from '../models/TopUpComponentType';

export const toTopUpComponentType = (provider: TopUpProvider): TopUpComponentType => {
  switch (provider) {
    case TopUpProvider.RAMP:
      return TopUpComponentType.ramp;
    case TopUpProvider.SAFELLO:
      return TopUpComponentType.safello;
    case TopUpProvider.WYRE:
      return TopUpComponentType.wyre;
  }
};
