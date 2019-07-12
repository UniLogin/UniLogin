import {CancelAuthorisationRequest, GetAuthorisationRequest, ensure} from '@universal-login/commons';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import WalletMasterContractService from '../../integration/ethereum/services/WalletMasterContractService';

class AuthorisationService {
  constructor(private authorisationStore: AuthorisationStore, private walletMasterContractService: WalletMasterContractService) {}

  addRequest(requestAuthorisation: any) {
    return this.authorisationStore.addRequest(requestAuthorisation);
  }

  async removeAuthorisationRequest(cancelAuthorisationRequest: CancelAuthorisationRequest) {
    await this.walletMasterContractService.ensureValidCancelAuthorisationRequestSignature(cancelAuthorisationRequest);

    const {walletContractAddress, publicKey} = cancelAuthorisationRequest;
    return this.authorisationStore.removeRequest(walletContractAddress, publicKey);
  }

  async getAuthorisationRequests(getAuthorisationRequest: GetAuthorisationRequest) {
    await this.walletMasterContractService.ensureValidGetAuthorisationRequestSignature(getAuthorisationRequest);

    const {walletContractAddress} = getAuthorisationRequest;
    return this.authorisationStore.getPendingAuthorisations(walletContractAddress);
  }
}

export default AuthorisationService;
