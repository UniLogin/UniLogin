import {RelayerRequest, recoverFromRelayerRequest} from '@universal-login/commons';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import RelayerRequestSignatureValidator from '../../integration/ethereum/RelayerRequestSignatureValidator';
import {AddAuthorisationRequest} from '../models/AddAuthorisationRequest';

class AuthorisationService {
  constructor(private authorisationStore: AuthorisationStore, private relayerRequestSignatureValidator: RelayerRequestSignatureValidator) {}

  addRequest(requestAuthorisation: AddAuthorisationRequest) {
    return this.authorisationStore.addRequest(requestAuthorisation);
  }

  async cancelAuthorisationRequest(authorisationRequest: RelayerRequest) {
    const recoveredAddress = recoverFromRelayerRequest(authorisationRequest);
    return this.authorisationStore.removeRequest(authorisationRequest.contractAddress, recoveredAddress);
  }

  async removeAuthorisationRequests(authorisationRequest: RelayerRequest) {
    await this.relayerRequestSignatureValidator.ensureValidRelayerRequestSignature(authorisationRequest);

    return this.authorisationStore.removeRequests(authorisationRequest.contractAddress);
  }

  async getAuthorisationRequests(authorisationRequest: RelayerRequest) {
    await this.relayerRequestSignatureValidator.ensureValidRelayerRequestSignature(authorisationRequest);

    return this.authorisationStore.getPendingAuthorisations(authorisationRequest.contractAddress);
  }
}

export default AuthorisationService;
