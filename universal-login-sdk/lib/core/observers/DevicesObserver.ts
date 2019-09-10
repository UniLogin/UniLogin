import deepEqual = require('deep-equal');
import clonedeep from 'lodash.clonedeep';
import {ConnectedDevice, RelayerRequest, ensure} from '@universal-login/commons';
import {ConcurrentDevices} from '../utils/errors';
import ObserverRunner from './ObserverRunner';
import {RelayerApi} from '../../integration/http/RelayerApi';

export class DevicesObserver extends ObserverRunner {
  private lastDevices: ConnectedDevice[] = [];
  private deviceRequest?: RelayerRequest;
  private callbacks: Function[] = [];

  constructor(private relayerApi: RelayerApi, tick: number = 1000) {
    super();
    this.tick = tick;
  }

  async execute() {
    return this.checkDevicesChangedFor(this.deviceRequest!);
  }

  async checkDevicesChangedFor(deviceRequest: RelayerRequest) {
    const devices = await this.fetchConnectedDevices(deviceRequest);
    if (!deepEqual(devices, this.lastDevices)) {
      this.lastDevices = clonedeep(devices);
      for (const callback of this.callbacks) {
        callback(devices);
      }
    }
  }

  private async fetchConnectedDevices(deviceRequest: RelayerRequest) {
    const {response} = await this.relayerApi.getConnectedDevices(deviceRequest);
    return response;
  }

  subscribe(deviceRequest: RelayerRequest, callback: Function) {
    ensure(
      !this.deviceRequest ||
      (this.deviceRequest.contractAddress === deviceRequest.contractAddress),
      ConcurrentDevices
    );

    callback(this.lastDevices);
    this.deviceRequest = deviceRequest;
    this.callbacks.push(callback);
    if (this.isStopped()) {
      this.start();
    }

    return () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.deviceRequest = undefined;
        this.lastDevices = [];
        this.stop();
      }
    };
  }
}
