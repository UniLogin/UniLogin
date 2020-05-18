import {Contract, utils, providers} from 'ethers';
import {isDataForFunctionCall, SignedMessage, RelayerRequest} from '@unilogin/commons';
import {GnosisSafeInterface, calculateMessageHash, IProxyInterface, ISignatureValidatorInterface, calculateGnosisStringHash, encodeDataForExecTransaction, gnosisSafe, ERC1271, isInvalidOwnerError} from '@unilogin/contracts';
import IWalletContractService from '../../core/models/IWalletContractService';
import {GAS_LIMIT_MARGIN, decodeDataForExecTransaction} from '../../core/utils/messages/serialisation';
import {decodeParametersFromData, getRemovedKey} from '../../core/utils/encodeData';
import {AddressZero} from 'ethers/constants';
import {TransactionGasPriceComputator} from './TransactionGasPriceComputator';
export const INVALID_MSG_HASH = '0x0000000000000000000000000000000000';

export class GnosisSafeService implements IWalletContractService {
  constructor(private provider: providers.Provider, private transactionGasPriceComputator: TransactionGasPriceComputator) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, GnosisSafeInterface, this.provider);
    const requiredSignatures = await walletContract.getThreshold();
    return requiredSignatures;
  }

  keyExist(walletAddress: string, key: string) {
    const walletContract = new Contract(walletAddress, GnosisSafeInterface, this.provider);
    return walletContract.isOwner(key);
  }

  calculateMessageHash(message: SignedMessage) {
    return calculateMessageHash(message);
  }

  recoverSignerFromMessage(message: SignedMessage) {
    return utils.recoverAddress(
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
    try {
      return await walletProxy.isValidSignature(message, signature);
    } catch (e) {
      if (isInvalidOwnerError(e)) {
        return ERC1271.INVALIDSIGNATURE;
      }
      throw e;
    }
  }

  getRelayerRequestMessage(relayerRequest: RelayerRequest) {
    return utils.hexlify(utils.toUtf8Bytes(relayerRequest.contractAddress));
  }

  recoverFromRelayerRequest(relayerRequest: RelayerRequest) {
    return utils.recoverAddress(
      calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(relayerRequest.contractAddress)), relayerRequest.contractAddress),
      relayerRequest.signature!,
    );
  }

  async messageToTransaction(message: SignedMessage, tokenPriceInEth: utils.BigNumberish) {
    return Object({
      gasPrice: await this.transactionGasPriceComputator.getGasPriceInEth(message.gasPrice, tokenPriceInEth),
      gasLimit: utils.bigNumberify(message.safeTxGas).add(message.baseGas).add(GAS_LIMIT_MARGIN),
      to: message.from,
      value: 0,
      data: encodeDataForExecTransaction(message),
    });
  }

  isAddKeyCall(data: string) {
    return isDataForFunctionCall(data, gnosisSafe.interfaces.GnosisSafeInterface, 'addOwnerWithThreshold');
  }

  isAddKeysCall(data: string) {
    return false;
  }

  isRemoveKeyCall(data: string) {
    return isDataForFunctionCall(data, gnosisSafe.interfaces.GnosisSafeInterface, 'removeOwner');
  }

  decodeKeyFromData(data: string) {
    if (this.isRemoveKeyCall(data)) {
      const parameters = decodeParametersFromData(data, ['address', 'address', 'uint256']);
      return [getRemovedKey(parameters)];
    }
    return decodeParametersFromData(data, ['address', 'uint256']);
  }

  decodeKeysFromData(data: string) {
    return [AddressZero];
  }

  decodeExecute(data: string) {
    return decodeDataForExecTransaction(data);
  }

  isValidMessageHash(messageHash: string, signedMessage: SignedMessage) {
    return messageHash !== INVALID_MSG_HASH;
  }
}
