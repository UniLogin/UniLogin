import {recoverFromRelayerRequest, RelayerRequest, hashRelayerRequest, ensure} from '@universal-login/commons';
import { ethers, providers} from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/Wallet.json';
import { UnauthorisedAddress } from '../../../core/utils/errors';

const MAGICVALUE = '0x20c13b0b';

class WalletMasterContractService {
  constructor(private provider: providers.Provider) {}

  async ensureValidSignature(walletContractAddress: string, signature: string, payloadDigest: string, recoveredAddress: string) {
    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, this.provider);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, signature);
    ensure(isCorrectAddress === MAGICVALUE, UnauthorisedAddress, recoveredAddress);
  }

  async ensureValidRelayerRequestSignature(relayerRequest: RelayerRequest) {
    const recoveredAddress = recoverFromRelayerRequest(relayerRequest);
    const {contractAddress, signature} = relayerRequest;
    const payloadDigest = hashRelayerRequest(relayerRequest);

    await this.ensureValidSignature(contractAddress, signature!, payloadDigest, recoveredAddress);
  }
}

export default WalletMasterContractService;
