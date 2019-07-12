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
    await this.authorisationStore.removeRequest(walletContractAddress, publicKey);
  }

  async getAuthorisationRequests(getAuthorisationRequest: GetAuthorisationRequest) {
    await this.walletMasterContractService.ensureValidGetAuthorisationRequestSignature(getAuthorisationRequest);

    const {walletContractAddress} = getAuthorisationRequest;
    const result = await this.authorisationStore.getPendingAuthorisations(walletContractAddress);
    return result;
  }
}

export default AuthorisationService;
