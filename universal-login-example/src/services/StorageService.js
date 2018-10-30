import localforage from 'localforage';

const IDENTITY_KEY = 'universal-login-identity';

class StorageService {
  constructor(driver = false) {
    if (driver) {
      localforage.setDriver(driver);
    }
  }

  async getIdentity() {
    return localforage.getItem(IDENTITY_KEY, async (value, err) => {
      if (err) {
        return null;
      }
      return value;
    });
  }

  async storeIdentity(identity) {
    return localforage.setItem(IDENTITY_KEY, identity, async (err) => {
      if (err) {
        return false;
      }
      return true;
    });
  }

  async clearStorage() {
    return localforage.clear();
  }
}

export default StorageService;
