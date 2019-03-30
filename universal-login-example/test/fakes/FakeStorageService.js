class FakeStorageService {
  constructor() {
    this.walletContract = null;
  }

  async getWallet() {
    return this.walletContract;
  }

  async storeWallet(walletContract) {
    this.walletContract = walletContract;
  }

  async clearStorage() {
    this.walletContract = {};
  }
}
export default FakeStorageService;
