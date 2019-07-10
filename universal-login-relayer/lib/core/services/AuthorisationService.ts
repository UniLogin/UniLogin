import {CancelAuthorisationRequest} from '@universal-login/commons';
import { providers} from 'ethers';
import AuthorisationStore from '../../integration/sql/services/AuthorisationStore';
import WalletMasterContractService from '../../integration/ethereum/services/WalletMasterContractService';

class AuthorisationService {
  constructor(private authorisationStore: AuthorisationStore, private walletMasterContractService: WalletMasterContractService) {}

  async ensureValidSignature(cancelAuthorisationRequest: CancelAuthorisationRequest) {
    await this.walletMasterContractService.ensureValidSignature(cancelAuthorisationRequest);

    const {walletContractAddress, publicKey} = cancelAuthorisationRequest;
    return this.authorisationStore.removeRequest(walletContractAddress, publicKey);
  }
}

export default AuthorisationService;
