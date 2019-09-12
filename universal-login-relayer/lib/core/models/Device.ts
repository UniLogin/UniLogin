import {DeviceInfo} from '@universal-login/commons';

export interface Device {
  contractAddress: string;
  publicKey: string;
  deviceInfo: DeviceInfo;
}
