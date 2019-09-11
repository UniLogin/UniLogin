import {DeviceInfo} from '@universal-login/commons';

export interface DeviceEntry {
  contractAddress: string;
  publicKey: string;
  deviceInfo: DeviceInfo;
}

export class DevicesStore {
  private devices: DeviceEntry[] = [];

  async add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    this.devices.push({contractAddress, publicKey, deviceInfo});
  }

  async get(contractAddress: string) {
    return this.devices
      .filter((deviceEntry: DeviceEntry) => deviceEntry.contractAddress === contractAddress)
      .map((deviceEntry: DeviceEntry) => deviceEntry.deviceInfo);
  }
}
