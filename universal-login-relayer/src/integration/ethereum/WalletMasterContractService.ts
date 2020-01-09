import {recoverFromRelayerRequest, RelayerRequest, hashRelayerRequest, ensure} from '@universal-login/commons';
import {providers, utils} from 'ethers';
import {UnauthorisedAddress} from '../../core/utils/errors';
import IWalletContractService from '../../core/models/IWalletContractService';

const MAGICVALUE = '0x20c13b0b';

class WalletMasterContractService {
  constructor(private provider: providers.Provider, private walletContractService: IWalletContractService) {}

  private async ensureValidSignature(walletContractAddress: string, signature: string, payloadDigest: string, recoveredAddress: string) {
    const isCorrectAddress = await this.walletContractService.isValidSignature(payloadDigest, walletContractAddress, signature);
    ensure(isCorrectAddress === MAGICVALUE, UnauthorisedAddress, recoveredAddress);
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
