import {CancelAuthorisationRequest, GetAuthorisationRequest, ensure} from '@universal-login/commons';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import WalletMasterContractService from '../../integration/ethereum/services/WalletMasterContractService';
import { AuthorisationKeyNotfound } from '../utils/errors';

class AuthorisationService {
  constructor(private authorisationStore: AuthorisationStore, private walletMasterContractService: WalletMasterContractService) {}

  async removeAuthorisationRequest(cancelAuthorisationRequest: CancelAuthorisationRequest) {
    await this.walletMasterContractService.ensureValidCancelAuthorisationRequestSignature(cancelAuthorisationRequest);

    const {walletContractAddress, publicKey} = cancelAuthorisationRequest;
    const pendingauthorisation = await this.authorisationStore.getPendingAuthorisations(walletContractAddress);
    ensure(pendingauthorisation.length !== 0, AuthorisationKeyNotfound, publicKey);

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
