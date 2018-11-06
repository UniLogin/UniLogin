import localforage from 'localforage';

const IDENTITY_KEY = 'universal-login-identity';

class StorageService {
  constructor(driver) {
    if (driver) {
      localforage.setDriver(driver);
    }
  }

  async getIdentity() {
    return localforage.getItem(IDENTITY_KEY, (value, err) => (err ? null : value));
  }

  async storeIdentity(identity) {
    return localforage.setItem(IDENTITY_KEY, identity, (err) => !!err);
  }

  async clearStorage() {
    return localforage.clear();
  }
}

export default StorageService;
