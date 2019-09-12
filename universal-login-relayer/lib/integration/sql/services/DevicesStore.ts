import {DeviceInfo} from '@universal-login/commons';
import Knex = require('knex');

export interface DeviceEntry {
  contractAddress: string;
  publicKey: string;
  deviceInfo: DeviceInfo;
}

export class DevicesStore {
  private devices: DeviceEntry[] = [];
  private tableName: string = 'devices';

  constructor(public database: Knex) {
  }

  async add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    this.devices.push({contractAddress, publicKey, deviceInfo});
  }

  async get(contractAddress: string) {
    return this.devices
      .filter((deviceEntry: DeviceEntry) => deviceEntry.contractAddress === contractAddress)
      .map((deviceEntry: DeviceEntry) => deviceEntry.deviceInfo);
  }

  async remove(contractAddress: string, publicKey: string) {
    const removedItems = this.devices.filter((deviceEntry: DeviceEntry) => deviceEntry.contractAddress === contractAddress && deviceEntry.publicKey === publicKey);
    this.devices = this.devices.filter((deviceEntry: DeviceEntry) => deviceEntry.contractAddress !== contractAddress || deviceEntry.publicKey !== publicKey);
    return removedItems.length;
  }
}
