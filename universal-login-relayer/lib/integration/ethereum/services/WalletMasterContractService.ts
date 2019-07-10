import {recoverFromCancelAuthorisationRequest, CancelAuthorisationRequest, hashCancelAuthorisationRequest, ensure} from '@universal-login/commons';
import { ethers, providers} from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import { UnauthorisedAddress } from '../../../core/utils/errors';

class WalletMasterContractService {
  constructor(private provider: providers.Provider) {}

  async ensureValidSignature(cancelAuthorisationRequest: CancelAuthorisationRequest) {
    const recoveredAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest);
    const {walletContractAddress, signature} = cancelAuthorisationRequest;

    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, this.provider);
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, signature);
    ensure(isCorrectAddress, UnauthorisedAddress, recoveredAddress);
  }
}

export default WalletMasterContractService;
