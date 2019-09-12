import {DeviceInfo} from './notifications';

export interface Device {
  contractAddress: string;
  publicKey: string;
  deviceInfo: DeviceInfo;
}
