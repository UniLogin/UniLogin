import {EventEmitter} from 'fbemitter';
import EthereumIdentitySDK from 'ethereum-identity-sdk';
import ethers from 'ethers';
import config from '../config/config';
import IdentityService from './IdentityService';

class Services {
  constructor() {
    this.config = config;
    this.emitter = new EventEmitter();
    this.provider = new ethers.providers.JsonRpcProvider(this.config.jsonRpcUrl);
    this.sdk = new EthereumIdentitySDK(this.config.relayerUrl, this.provider);
    this.identityService = new IdentityService(this.sdk, this.emitter);
  }
}

export default Services;
