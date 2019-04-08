import Knex from 'knex';

declare interface Request {
  walletContractAddress: string;
  key: string;
  deviceInfo: object;
}
class AuthorisationService {
  constructor(private database : Knex) {}

  async addRequest(request: Request) {
    const {walletContractAddress, key, deviceInfo} = request;
    return this.database.insert({walletContractAddress, key: key.toLowerCase(), deviceInfo})
      .into('authorisations')
      .returning('id');
  }

  getPendingAuthorisations(walletContractAddress: string) {
    return this.database('authorisations')
      .where({walletContractAddress})
      .select();
  }

  async removeRequest(walletContractAddress: string, key: string) {
    await this.database('authorisations')
      .where('walletContractAddress', walletContractAddress)
      .where('key', key)
      .del();
  }
}

export default AuthorisationService;
