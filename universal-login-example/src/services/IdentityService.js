import ethers, {Wallet} from 'ethers';

class IdentityService {
  constructor(sdk, emitter, storageService, provider) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.identity = {};
    this.deviceAddress = '';
    this.storageService = storageService;
    this.provider = provider;
  }

  async loadIdentity() {
    const identity = await this.storageService.getIdentity();
    if (identity) {
      this.identity = identity;
      this.emitter.emit('setView', 'MainScreen');
      return true;
    }
    return false;
  }

  async connect() {
    this.privateKey = await this.sdk.connect(
      this.identity.address
    );
    const {address} = new Wallet(this.privateKey);
    this.subscription = this.sdk.subscribe(
      'KeyAdded',
      this.identity.address,
      (event) => {
        if (event.address === address) {
          this.cancelSubscription();
          this.identity = {
            name: this.identity.name,
            privateKey: this.privateKey,
            address: this.identity.address
          };
          this.emitter.emit('setView', 'Greeting', {greetMode: 'addKey'});
          this.storeIdentity(this.identity);
        }
      }
    );
  }

  async recover() {
    this.privateKey = await ethers.Wallet.createRandom().privateKey;
    const {address} = new Wallet(this.privateKey, this.provider);
    this.deviceAddress = address;
    this.subscription = this.sdk.subscribe(
      'KeyAdded',
      this.identity.address,
      (event) => {
        if (event.address === address) {
          this.cancelSubscription();
          this.identity = {
            name: this.identity.name,
            privateKey: this.privateKey,
            address: this.identity.address
          };
          this.emitter.emit('setView', 'Greeting');
          this.storeIdentity(this.identity);
        }
      }
    );
  }

  cancelSubscription() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  async storeIdentity(identity) {
    this.storageService.storeIdentity(identity);
  }

  async disconnect() {
    this.storageService.clearStorage();
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

  async execute(message) {
    await this.sdk.execute(
      this.identity.address,
      message,
      this.identity.privateKey
    );
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
