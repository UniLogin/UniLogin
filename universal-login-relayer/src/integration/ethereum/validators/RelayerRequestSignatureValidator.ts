import {RelayerRequest, ensure, ensureNotFalsy} from '@universal-login/commons';
import {ERC1271} from '@universal-login/contracts';
import {UnauthorisedAddress, SignatureNotFound} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';

class RelayerRequestSignatureValidator {
  constructor(private walletContractService: WalletContractService) {}

  async ensureValidRelayerRequestSignature(relayerRequest: RelayerRequest) {
    ensureNotFalsy(relayerRequest.signature, SignatureNotFound);
    const {contractAddress, signature} = relayerRequest;
    const signer = await this.recoverSigner(relayerRequest);
    const payloadDigest = await this.walletContractService.getRelayerRequestMessage(relayerRequest);
    let isCorrectAddress;
    try {
      isCorrectAddress = await this.walletContractService.isValidSignature(payloadDigest, contractAddress, signature!);
    } catch (e) {
      if (this.isInvalidOwnerError(e)) {
        throw new UnauthorisedAddress(signer);
      } else {
        throw e;
      }
    }
    ensure(isCorrectAddress === ERC1271.MAGICVALUE, UnauthorisedAddress, signer);
  }

  recoverSigner = (relayerRequest: RelayerRequest) => this.walletContractService.recoverFromRelayerRequest(relayerRequest);

  isInvalidOwnerError = (error: Error) => error.message === 'VM Exception while processing transaction: revert Invalid owner provided';
}

export default RelayerRequestSignatureValidator;
