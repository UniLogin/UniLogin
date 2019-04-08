import localforage from 'localforage';

const WALLET_CONTRACT_KEY = '@universal-login/wallet-info';

class StorageService {
  constructor(driver) {
    if (driver) {
      localforage.setDriver(driver);
    }
  }

  async getWallet() {
    return localforage.getItem(WALLET_CONTRACT_KEY, (value, err) => (err ? null : value));
  }

  async storeWallet(walletContract) {
    return localforage.setItem(WALLET_CONTRACT_KEY, walletContract, (err) => !!err);
  }

  async clearStorage() {
    return localforage.clear();
  }
}

export default StorageService;
