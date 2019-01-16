class FakeStorageService {
  constructor() {
    this.identity = null;
  }

  async getIdentity() {
    return this.identity;
  }

  async storeIdentity(identity) {
    this.identity = identity;
  }

  async clearStorage() {
    this.identity = {};
  }
}
export default FakeStorageService;
