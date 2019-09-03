import {AuthorisationRequest} from '@universal-login/commons';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import WalletMasterContractService from '../../integration/ethereum/services/WalletMasterContractService';

class AuthorisationService {
  constructor(private authorisationStore: AuthorisationStore, private walletMasterContractService: WalletMasterContractService) {}

  addRequest(requestAuthorisation: any) {
    return this.authorisationStore.addRequest(requestAuthorisation);
  }

  async removeAuthorisationRequest(authorisationRequest: AuthorisationRequest) {
    await this.walletMasterContractService.ensureValidAuthorisationRequestSignature(authorisationRequest);

    return this.authorisationStore.removeRequests(authorisationRequest.contractAddress);
  }

  async getAuthorisationRequests(authorisationRequest: AuthorisationRequest) {
    await this.walletMasterContractService.ensureValidAuthorisationRequestSignature(authorisationRequest);

    return this.authorisationStore.getPendingAuthorisations(authorisationRequest.contractAddress);
  }
}

export default AuthorisationService;
