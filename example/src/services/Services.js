import {EventEmitter} from 'fbemitter';
import EthereumIdentitySDK from 'ethereum-identity-sdk';
import ethers from 'ethers';
import {jsonRpcUrl, relayerUrl} from '../config/config';
import IdentityService from './IdentityService';

class Services {
  constructor() {
    this.emitter = new EventEmitter();
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
    this.sdk = new EthereumIdentitySDK(relayerUrl, this.provider);
    this.identityService = new IdentityService(this.sdk, this.emitter);
  }
}

export default Services;
