import {Sanitizer, asObject, asString} from '@restless/sanitizers';
import {ApplicationInfo} from '../../models/notifications';

export const asApplicationInfo: Sanitizer<ApplicationInfo> = asObject<ApplicationInfo>({
  applicationName: asString,
  logo: asString,
  type: asString,
});
