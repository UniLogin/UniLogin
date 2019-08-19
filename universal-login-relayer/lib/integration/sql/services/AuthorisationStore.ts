import Knex from 'knex';

export interface AuthorisationRequest {
  walletContractAddress: string;
  key: string;
  deviceInfo: object;
}

class AuthorisationStore {
  constructor(private database : Knex) {}

  addRequest(request: AuthorisationRequest) {
    const {walletContractAddress, key, deviceInfo} = request;
    return this.database.insert({walletContractAddress, key, deviceInfo})
      .into('authorisations')
      .returning('id');
  }

  getPendingAuthorisations(walletContractAddress: string) {
    return this.database('authorisations')
      .where({walletContractAddress})
      .select();
  }

  removeRequest(walletContractAddress: string, publicKey: string) {
    return this.database('authorisations')
      .where('walletContractAddress', walletContractAddress)
      .where('key', publicKey)
      .del();
  }
}

export default AuthorisationStore;
