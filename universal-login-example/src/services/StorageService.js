import localforage from 'localforage';

const IDENTITY_KEY = 'universal-login-identity';

class StorageService {
  constructor(driver = false) {
    if (driver) {
      localforage.setDriver(driver);
    }
  }

  async getIdentity() {
    return await localforage.getItem(IDENTITY_KEY, async (value, err) => {
      if (err) {
        return null;
      }
      return value;
    });
  }

  async storeIdentity(identity) {
    return await localforage.setItem(IDENTITY_KEY, identity, async (err) => {
      if (err) {
        return false;
      }
      return true;
    });
  }

  async clearStorage() {
    return await localforage.clear();
  }
}

export default StorageService;
