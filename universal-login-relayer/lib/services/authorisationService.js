class AuthorisationService {
  constructor(database) {
    this.pendingAuthorisations = {};
    this.index = 0;
    this.database = database;
  }


  async addRequest(request) {
    const {identityAddress, key, deviceInfo} = request;
    return await this.database.insert({identityAddress, key: key.toLowerCase(), deviceInfo})
      .into('authorisations')
      .returning('id');
  }

  getPendingAuthorisations(identityAddress) {
    return this.database('authorisations')
      .where({identityAddress})
      .select();
  }

  async removeRequest(identityAddress, key) {
    await this.database('authorisations')
      .where('identityAddress', identityAddress)
      .where('key', key)
      .del();
  }
}

export default AuthorisationService;
