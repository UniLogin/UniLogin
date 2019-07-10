import {recoverFromCancelAuthorisationRequest, CancelAuthorisationRequest, hashCancelAuthorisationRequest, ensure} from '@universal-login/commons';
import { ethers, providers} from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import { UnauthorisedAddress } from '../../../core/utils/errors';
import AuthorisationStore from '../../sql/services/AuthorisationStore';

class AuthorisationService {
  constructor(private provider: providers.Provider) {}

  async ensureValidSignature(cancelAuthorisationRequest: CancelAuthorisationRequest, authorisationStore: AuthorisationStore) {
    const recoveredAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest);
    const {walletContractAddress, signature, publicKey} = cancelAuthorisationRequest;

    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, this.provider);
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, signature);
    ensure(isCorrectAddress, UnauthorisedAddress, recoveredAddress);

    return authorisationStore.removeRequest(walletContractAddress, publicKey);
  }
}

export default AuthorisationService;
