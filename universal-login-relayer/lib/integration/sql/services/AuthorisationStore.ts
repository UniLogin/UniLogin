import Knex from 'knex';

export interface AddAuthorisationRequest {
  walletContractAddress: string;
  key: string;
  deviceInfo: object;
}

class AuthorisationStore {
  constructor(private database : Knex) {}

  addRequest(request: AddAuthorisationRequest) {
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

  removeRequest(contractAddress: string, key: string) {
    return this.database('authorisations')
      .where('walletContractAddress', contractAddress)
      .where('key', key)
      .del();
  }

  removeRequests(contractAddress: string) {
    return this.database('authorisations')
      .where('walletContractAddress', contractAddress)
      .del();
  }
}

export default AuthorisationStore;
