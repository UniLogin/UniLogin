import {Wallet} from 'ethers';

class WalletService {
  constructor(sdk, emitter, storageService, provider) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.walletContract = {};
    this.deviceAddress = '';
    this.storageService = storageService;
    this.provider = provider;
  }

  async loadWallet() {
    const walletContract = await this.storageService.getWallet();
    if (walletContract) {
      this.walletContract = walletContract;
      this.emitter.emit('setView', 'MainScreen');
      return true;
    }
    return false;
  }

  async connect() {
    this.privateKey = await this.sdk.connect(this.walletContract.address);
    const {address} = new Wallet(this.privateKey);
    const filter = {contractAddress: this.walletContract.address, key: address};
    this.subscription = this.sdk.subscribe('KeyAdded', filter, () => {
      this.onKeyAdded({greetMode: 'addKey'});
    });
  }

  async recover() {
    this.privateKey = await Wallet.createRandom().privateKey;
    const {address} = new Wallet(this.privateKey, this.provider);
    this.deviceAddress = address;
    const filter = {contractAddress: this.walletContract.address, key: address};
    this.subscription = this.sdk.subscribe('KeyAdded', filter, () => {
      this.onKeyAdded();
    });
  }

  onKeyAdded(viewOptions = {}) {
    this.cancelSubscription();
    this.walletContract = {
      name: this.walletContract.name,
      privateKey: this.privateKey,
      address: this.walletContract.address
    };
    this.emitter.emit('setView', 'Greeting', viewOptions);
    this.storeWallet(this.walletContract);
  }

  cancelSubscription() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  async storeWallet(walletContract) {
    this.storageService.storeWallet(walletContract);
  }

  async disconnect() {
    this.storageService.clearStorage();
  }

  async createWallet(name) {
    this.emitter.emit('creatingWalletContract', {name});
    const [privateKey, address] = await this.sdk.create(name);
    this.walletContract = {
      name,
      privateKey,
      address
    };
    this.emitter.emit('walletContractCreated', this.walletContract);
    this.storeWallet(this.walletContract);
  }

  async execute(message) {
    return this.sdk.execute(
      message,
      this.walletContract.privateKey
    );
  }

  async getWalletContractAddress(walletContract) {
    const walletContractAddress = await this.sdk.getWalletContractAddress(walletContract);
    if (walletContractAddress) {
      this.walletContract = {name: walletContract, address: walletContractAddress};
      return true;
    }
  }
}

export default WalletService;
