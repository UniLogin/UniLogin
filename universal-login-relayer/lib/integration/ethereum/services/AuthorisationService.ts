import {recoverFromCancelAuthorisationRequest, CancelAuthorisationRequest, hashCancelAuthorisationRequest} from '@universal-login/commons';
import { ethers, providers} from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import { UnauthorisedAddress } from '../../../core/utils/errors';

class AuthorisationService {
  constructor(private provider: providers.Provider) {}

  async isValidSignature(cancelAuthorisationRequest: CancelAuthorisationRequest) {
    const recoveredAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest);
    const {walletContractAddress, signature} = cancelAuthorisationRequest;

    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, this.provider);
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, signature);
    if (!isCorrectAddress) {
        throw new UnauthorisedAddress(recoveredAddress);
    }
  }
}

export default AuthorisationService;
