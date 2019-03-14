class FakeStorageService {
  constructor() {
    this.identity = null;
  }

  async getWallet() {
    return this.identity;
  }

  async storeWallet(identity) {
    this.identity = identity;
  }

  async clearStorage() {
    this.identity = {};
  }
}
export default FakeStorageService;
