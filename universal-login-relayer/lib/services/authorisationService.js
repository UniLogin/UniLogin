class AuthorisationService {
  constructor(database) {
    this.pendingAuthorisations = {};
    this.database = database;
  }

  async addRequest(request) {
    const {walletContractAddress, key, deviceInfo} = request;
    return this.database.insert({walletContractAddress, key: key.toLowerCase(), deviceInfo})
      .into('authorisations')
      .returning('id');
  }

  getPendingAuthorisations(walletContractAddress) {
    return this.database('authorisations')
      .where({walletContractAddress})
      .select();
  }

  async removeRequest(walletContractAddress, key) {
    await this.database('authorisations')
      .where('walletContractAddress', walletContractAddress)
      .where('key', key)
      .del();
  }
}

export default AuthorisationService;
