import {recoverFromCancelAuthorisationRequest, recoverFromGetAuthorisationRequest, GetAuthorisationRequest, hashGetAuthorisationRequest, CancelAuthorisationRequest, hashCancelAuthorisationRequest, ensure} from '@universal-login/commons';
import { ethers, providers} from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import { UnauthorisedAddress } from '../../../core/utils/errors';

class WalletMasterContractService {
  constructor(private provider: providers.Provider) {}

  async ensureValidSignature(walletContractAddress: string, signature: string, payloadDigest: string, recoveredAddress: string) {
    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, this.provider);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, signature);
    ensure(isCorrectAddress, UnauthorisedAddress, recoveredAddress);
  }

  async ensureValidCancelAuthorisationRequestSignature(cancelAuthorisationRequest: CancelAuthorisationRequest) {
    const recoveredAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest);
    const {walletContractAddress, signature} = cancelAuthorisationRequest;
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);

    await this.ensureValidSignature(walletContractAddress, signature, payloadDigest, recoveredAddress);
  }

  async ensureValidGetAuthorisationRequestSignature(getAuthorisationRequest: GetAuthorisationRequest) {
    const recoveredAddress = recoverFromGetAuthorisationRequest(getAuthorisationRequest);
    const {walletContractAddress, signature} = getAuthorisationRequest;
    const payloadDigest = hashGetAuthorisationRequest(getAuthorisationRequest);

    await this.ensureValidSignature(walletContractAddress, signature, payloadDigest, recoveredAddress);
  }
}

export default WalletMasterContractService;
