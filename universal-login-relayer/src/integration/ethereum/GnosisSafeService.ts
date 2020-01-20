import {Contract, utils, providers} from 'ethers';
import {SignedMessage, RelayerRequest} from '@universal-login/commons';
import {GnosisSafeInterface, calculateMessageHash, IProxyInterface, ISignatureValidatorInterface, calculateGnosisStringHash, encodeDataForExecTransaction} from '@universal-login/contracts';
import IWalletContractService from '../../core/models/IWalletContractService';
import {GAS_LIMIT_MARGIN} from '../../core/utils/messages/serialisation';

export class GnosisSafeService implements IWalletContractService {
  constructor(private provider: providers.Provider) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, GnosisSafeInterface, this.provider);
    const requiredSignatures = await walletContract.getThreshold();
    return requiredSignatures;
  }

  async keyExist(walletAddress: string, key: string) {
    const walletContract = new Contract(walletAddress, GnosisSafeInterface, this.provider);
    return walletContract.isOwner(key);
  }

  calculateMessageHash(message: SignedMessage) {
    return calculateMessageHash(message);
  }

  recoverSignerFromMessage(message: SignedMessage) {
    return utils.verifyMessage(
      this.calculateMessageHash(message),
      message.signature,
    );
  }

  fetchMasterAddress(walletAddress: string): Promise<string> {
    const walletProxy = new Contract(walletAddress, IProxyInterface, this.provider);
    return walletProxy.masterCopy();
  }

  async isValidSignature(message: string, walletAddress: string, signature: string) {
    const walletProxy = new Contract(walletAddress, ISignatureValidatorInterface, this.provider);
    return walletProxy.isValidSignature(message, signature);
  }

  getRelayerRequestMessage(relayerRequest: RelayerRequest) {
    return utils.hexlify(utils.toUtf8Bytes(relayerRequest.contractAddress));
  }

  recoverFromRelayerRequest(relayerRequest: RelayerRequest) {
    return utils.recoverAddress(
      calculateGnosisStringHash(relayerRequest.contractAddress, relayerRequest.contractAddress),
      relayerRequest.signature!,
    );
  }

  messageToTransaction(message: SignedMessage) {
    return Object({
      gasPrice: message.gasPrice,
      gasLimit: utils.bigNumberify(message.safeTxGas).add(message.baseGas).add(GAS_LIMIT_MARGIN),
      to: message.from,
      value: 0,
      data: encodeDataForExecTransaction(message),
    });
  }

  isAddKeyCall(data: string) {
    return false;
  }

  isAddKeysCall(data: string) {
    return false;
  }

  isRemoveKeyCall(data: string) {
    return false;
  }
}
