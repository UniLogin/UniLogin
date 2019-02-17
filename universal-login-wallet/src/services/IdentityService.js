import {Wallet} from 'ethers';

class IdentityService {
  constructor(sdk, emitter) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.identity = {};
  }

  async create(name) {
    const [privateKey, address] = await this.sdk.create(name);
    this.identity = {
      name,
      privateKey,
      address
    };
    return this.identity;
  }
}

export default IdentityService;
