class IdentityService {
  constructor(sdk, emitter) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.identity = {};
  }

  async createIdentity(name) {
    this.identity = {name};
    this.emitter.emit('creatingIdentity', this.identity);
    let [privateKey, address] = await this.sdk.create(name);
    this.identity = {
      name,
      privateKey,
      address
    };
    this.emitter.emit('identityCreated', this.identity);
  }
}

export default IdentityService;
