import {recoverFromRelayerRequest, RelayerRequest, ensure} from '@universal-login/commons';
import {ERC1271} from '@universal-login/contracts';
import {UnauthorisedAddress} from '../../core/utils/errors';
import IWalletContractService from '../../core/models/IWalletContractService';

class WalletMasterContractService {
  constructor(private walletContractService: IWalletContractService) {}

  async ensureValidRelayerRequestSignature(relayerRequest: RelayerRequest) {
    const recoveredAddress = recoverFromRelayerRequest(relayerRequest);
    const {contractAddress, signature} = relayerRequest;
    const payloadDigest = await this.walletContractService.getRelayerRequestMessage(relayerRequest, contractAddress);

    const isCorrectAddress = await this.walletContractService.isValidSignature(payloadDigest, contractAddress, signature!);
    ensure(isCorrectAddress === ERC1271.MAGICVALUE, UnauthorisedAddress, recoveredAddress);
  }
}

export default WalletMasterContractService;
