import {Wallet} from 'ethers';

class IdentityService {
  constructor(sdk, emitter, storageService) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.identity = {};
    this.deviceAddress = '';
    this.storageService = storageService;
  }

  async connect(label) {
    this.privateKey = await this.sdk.connect(this.identity.address, label);
    const {address} = new Wallet(this.privateKey);
    this.deviceAddress = address;
    this.subscription = this.sdk.subscribe('KeyAdded', this.identity.address, (event) => {
      if (event.address == address) {
        this.cancelSubscription();
        this.identity = {
          name: this.identity.name,
          privateKey: this.privateKey,
          address: this.identity.address
        };
        this.emitter.emit('setView', 'MainScreen');
        this.storeIdentity(this.identity, this.deviceAddress);
      }
    });
  }

  async storeIdentity(identity, deviceAddress) {
    this.storageService.storeIdentity(identity);
    this.storageService.storeDevice('This Device', deviceAddress);
  }

  cancelSubscription() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  async createIdentity(name) {
    this.emitter.emit('creatingIdentity', {name});
    let [privateKey, address, deviceAddress] = await this.sdk.create(name);
    this.identity = {
      name,
      privateKey,
      address
    };
    this.deviceAddress = deviceAddress;
    this.emitter.emit('identityCreated', this.identity);
    this.storeIdentity(this.identity, this.deviceAddress);
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
