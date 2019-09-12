import {DeviceInfo} from '@universal-login/commons';
import Knex = require('knex');
import {Device} from '../../../core/models/Device';

export class DevicesStore {
  private devices: Device[] = [];
  private tableName: string = 'devices';

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
