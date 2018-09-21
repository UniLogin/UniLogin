class IdentityService {
  constructor(sdk, emitter) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.identity = {};
  }

  async createIdentity(name) {
    this.emitter.emit('creatingIdentity', {name});
    let [privateKey, address] = await this.sdk.create(name);
    this.identity = {
      name,
      privateKey,
      address
    };
    this.emitter.emit('identityCreated', this.identity);
  }

  async execute(message) {
    await this.sdk.execute(this.identity.address, message, this.identity.privateKey);
  }

  async identityExist(identity) {
    const identityAddress = await this.sdk.identityExist(identity);
    if (identityAddress) {
      this.identity = {name: identity, address: identityAddress};
      return true;
    }
  }
}

export default IdentityService;
