import {RelayerRequest, recoverFromRelayerRequest} from '@universal-login/commons';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import WalletMasterContractService from '../../integration/ethereum/services/WalletMasterContractService';

class AuthorisationService {
  constructor(private authorisationStore: AuthorisationStore, private walletMasterContractService: WalletMasterContractService) {}

  addRequest(requestAuthorisation: any) {
    return this.authorisationStore.addRequest(requestAuthorisation);
  }

  async cancelAuthorisationRequest(authorisationRequest: RelayerRequest) {
    const recoveredAddress = recoverFromRelayerRequest(authorisationRequest);
    return this.authorisationStore.removeRequest(authorisationRequest.contractAddress, recoveredAddress);
  }

  async removeAuthorisationRequest(authorisationRequest: RelayerRequest) {
    await this.walletMasterContractService.ensureValidAuthorisationRequestSignature(authorisationRequest);

    return this.authorisationStore.removeRequests(authorisationRequest.contractAddress);
  }

  async getAuthorisationRequests(authorisationRequest: RelayerRequest) {
    await this.walletMasterContractService.ensureValidAuthorisationRequestSignature(authorisationRequest);

    return this.authorisationStore.getPendingAuthorisations(authorisationRequest.contractAddress);
  }
}

export default AuthorisationService;
