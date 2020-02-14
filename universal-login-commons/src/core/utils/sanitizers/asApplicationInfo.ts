import {asObject, asString} from '@restless/sanitizers';
import {ApplicationInfo} from '../../models/notifications';

export const asApplicationInfo = asObject<ApplicationInfo>({
  applicationName: asString,
  logo: asString,
  type: asString,
});
