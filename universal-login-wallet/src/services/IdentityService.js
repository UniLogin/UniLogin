import {Wallet} from 'ethers';

class IdentityService {
  constructor(sdk, emitter) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.identity = {};
  }

  async createIdentity(name) {
    this.emitter.emit('creatingIdentity', {name});
    const [privateKey, address] = await this.sdk.create(name);
    this.identity = {
      name,
      privateKey,
      address
    };
    this.emitter.emit('identityCreated', this.identity);
    this.storeIdentity(this.identity);
  }


}

export default IdentityService;
