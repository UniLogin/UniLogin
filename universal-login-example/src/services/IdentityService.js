import {Wallet} from 'ethers';

class IdentityService {
  constructor(sdk, emitter) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.identity = {};
  }

  async connect(label) {
    this.privateKey = await this.sdk.connect(this.identity.address, label);
    const {address} = new Wallet(this.privateKey);
    this.subscription = this.sdk.subscribe('KeyAdded', this.identity.address, (event) => {
      if (event.address == address) {
        this.cancelSubscription();
        this.identity = {
          name: this.identity.name,
          privateKey: this.privateKey,
          address: this.identity.address
        };
        this.emitter.emit('setView', 'MainScreen');
      }
    });
  }

  cancelSubscription() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
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
