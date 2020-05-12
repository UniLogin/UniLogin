import {Device, DeviceInfo} from '@unilogin/commons';
import Knex from 'knex';

export class DevicesStore {
  private tableName = 'devices';

  constructor(public database: Knex) {
  }

  add(contractAddress: string, publicKey: string, deviceInfo: DeviceInfo) {
    return this.database(this.tableName).insert({contractAddress, publicKey, deviceInfo});
  }

  async get(contractAddress: string): Promise<Device[]> {
    return this.database(this.tableName)
      .where({contractAddress})
      .select();
  }

  remove(contractAddress: string, publicKey: string) {
    return this.database(this.tableName)
      .where({contractAddress})
      .andWhere({publicKey})
      .del();
  }
}
