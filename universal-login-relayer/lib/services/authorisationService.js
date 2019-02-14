class AuthorisationService {
  constructor(database) {
    this.pendingAuthorisations = {};
    this.database = database;
  }

  async addRequest(request) {
    const {identityAddress, key, deviceInfo} = request;
    return this.database.insert(identityAddress, key.toLowerCase(), deviceInfo);
  }

  async getPendingAuthorisations(identityAddress) {
    return this.database.find(identityAddress);
  }

  async removeRequest(identityAddress, key) {
    await await this.database.delete(identityAddress, key);
  }
}

export default AuthorisationService;
