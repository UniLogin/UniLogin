import {RelayerRequest, ensure, ensureNotFalsy} from '@unilogin/commons';
import {ERC1271} from '@unilogin/contracts';
import {UnauthorisedAddress, SignatureNotFound} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';

class RelayerRequestSignatureValidator {
  constructor(private walletContractService: WalletContractService) {}

  async ensureValidRelayerRequestSignature(relayerRequest: RelayerRequest) {
    ensureNotFalsy(relayerRequest.signature, SignatureNotFound);
    const {contractAddress, signature} = relayerRequest;
    const signer = await this.walletContractService.recoverFromRelayerRequest(relayerRequest);
    const payloadDigest = await this.walletContractService.getRelayerRequestMessage(relayerRequest);
    const isCorrectAddress = await this.walletContractService.isValidSignature(payloadDigest, contractAddress, signature);
    ensure(isCorrectAddress === ERC1271.MAGICVALUE, UnauthorisedAddress, signer);
  }
}

export default RelayerRequestSignatureValidator;
