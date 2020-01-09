import {recoverFromRelayerRequest, RelayerRequest, hashRelayerRequest, ensure} from '@universal-login/commons';
import {ERC1271} from '@universal-login/contracts';
import {utils} from 'ethers';
import {UnauthorisedAddress} from '../../core/utils/errors';
import IWalletContractService from '../../core/models/IWalletContractService';

class WalletMasterContractService {
  constructor(private walletContractService: IWalletContractService) {}

  private async ensureValidSignature(walletContractAddress: string, signature: string, payloadDigest: string, recoveredAddress: string) {
    const isCorrectAddress = await this.walletContractService.isValidSignature(payloadDigest, walletContractAddress, signature);
    ensure(isCorrectAddress === ERC1271.MAGICVALUE, UnauthorisedAddress, recoveredAddress);
  }

  async ensureValidRelayerRequestSignature(relayerRequest: RelayerRequest) {
    const recoveredAddress = recoverFromRelayerRequest(relayerRequest);
    const {contractAddress, signature} = relayerRequest;
    const payloadDigest = hashRelayerRequest(relayerRequest);

    await this.ensureValidSignature(contractAddress, signature!, payloadDigest, recoveredAddress);
  }

  async ensureValidRelayerRequestSignatureForGnosis(relayerRequest: RelayerRequest) {
    const recoveredAddress = recoverFromRelayerRequest(relayerRequest);
    const {contractAddress, signature} = relayerRequest;
    await this.ensureValidSignature(contractAddress, signature!, utils.hexlify(utils.toUtf8Bytes(relayerRequest.contractAddress)), recoveredAddress);
  }
}

export default WalletMasterContractService;
