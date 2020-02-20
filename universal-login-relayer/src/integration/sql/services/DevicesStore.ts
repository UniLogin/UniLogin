import {Device, DeviceInfo} from '@unilogin/commons';
import Knex from 'knex';

export class DevicesStore {
  private devices: Device[] = [];
  private tableName = 'devices';

  constructor(public database: Knex) {
  }

  async add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    this.devices.push({contractAddress, publicKey, deviceInfo});
    return this.database(this.tableName).insert({contractAddress, publicKey, deviceInfo});
  }

  async get(contractAddress: string): Promise<Device[]> {
    return this.database(this.tableName)
      .where({contractAddress})
      .select();
  }

  async remove(contractAddress: string, publicKey: string) {
    return this.database(this.tableName)
      .where({contractAddress})
      .andWhere({publicKey})
      .delete();
  }
}
