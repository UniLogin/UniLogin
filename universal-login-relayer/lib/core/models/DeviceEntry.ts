import {DeviceInfo} from '@universal-login/commons';

export interface DeviceEntry {
  contractAddress: string;
  publicKey: string;
  deviceInfo: DeviceInfo;
}
