import {asObject, asString, asEnum} from '@restless/sanitizers';
import {ApplicationInfo, DeviceType} from '../../models/notifications';

export const asDeviceType = asEnum<DeviceType>(['laptop', 'phone', 'tablet', 'unknown'], 'DeviceType');

export const asApplicationInfo = asObject<ApplicationInfo>({
  applicationName: asString,
  logo: asString,
  type: asDeviceType,
});
