import {RelayerRequest, ensure} from '@universal-login/commons';
import {ERC1271} from '@universal-login/contracts';
import {UnauthorisedAddress} from '../../../core/utils/errors';
import IWalletContractService from '../../../core/models/IWalletContractService';

class RelayerRequestSignatureValidator {
  constructor(private walletContractService: IWalletContractService) {}

  async ensureValidRelayerRequestSignature(relayerRequest: RelayerRequest) {
    const {contractAddress, signature} = relayerRequest;
    const signer = await this.walletContractService.recoverFromRelayerRequest(relayerRequest);
    const payloadDigest = await this.walletContractService.getRelayerRequestMessage(relayerRequest);
    const isCorrectAddress = await this.walletContractService.isValidSignature(payloadDigest, contractAddress, signature!);
    ensure(isCorrectAddress === ERC1271.MAGICVALUE, UnauthorisedAddress, signer);
  }
}

export default RelayerRequestSignatureValidator;
