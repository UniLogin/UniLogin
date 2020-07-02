import {providers, Contract, utils} from 'ethers';
import {calculateMessageHash, SignedMessage, RelayerRequest, hashRelayerRequest, recoverFromRelayerRequest} from '@unilogin/commons';
import {WalletContractInterface} from '@unilogin/contracts';
import {getKeyFromHashAndSignature, isAddKeyCall, isAddKeysCall, isRemoveKeyCall, decodeParametersFromData} from '../../core/utils/encodeData';
import IWalletContractService from '../../core/models/IWalletContractService';
import {beta2} from '@unilogin/contracts';
import {messageToTransaction, decodeDataForExecuteSigned} from '../../core/utils/messages/serialisation';
import {TransactionGasPriceComputator} from './TransactionGasPriceComputator';

export class Beta2Service implements IWalletContractService {
  constructor(private provider: providers.Provider, private transactionGasPriceComputator: TransactionGasPriceComputator) {
  }

  async getRequiredSignatures(walletAddress: string): Promise<utils.BigNumber> {
    const walletContract = new Contract(walletAddress, WalletContractInterface, this.provider);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
  }

  keyExist(walletAddress: string, key: string) {
    const walletContract = new Contract(walletAddress, WalletContractInterface, this.provider);
    return walletContract.keyExist(key);
  }

  calculateMessageHash(message: SignedMessage) {
    return calculateMessageHash(message);
  }

  recoverSignerFromMessage(message: SignedMessage) {
    return getKeyFromHashAndSignature(
      this.calculateMessageHash(message),
      message.signature,
    );
  }

  fetchMasterAddress(walletAddress: string): Promise<string> {
    const walletProxy = new Contract(walletAddress, beta2.WalletProxy.interface, this.provider);
    return walletProxy.implementation();
  }

  isValidSignature(message: string, walletAddress: string, signature: string) {
    const contract = new Contract(walletAddress, beta2.WalletContract.interface as any, this.provider);
    return contract.isValidSignature(message, signature);
  }

  getRelayerRequestMessage(relayerRequest: RelayerRequest) {
    return hashRelayerRequest(relayerRequest);
  }

  recoverFromRelayerRequest(relayerRequest: RelayerRequest) {
    return recoverFromRelayerRequest(relayerRequest);
  }

  async messageToTransaction(message: SignedMessage, tokenPriceInEth: utils.BigNumberish) {
    return {...messageToTransaction(message), gasPrice: await this.transactionGasPriceComputator.getGasPriceInEth(message.gasPrice, tokenPriceInEth)};
  }

  isAddKeyCall(data: string) {
    return isAddKeyCall(data);
  }

  isAddKeysCall(data: string) {
    return isAddKeysCall(data);
  }

  isRemoveKeyCall(data: string) {
    return isRemoveKeyCall(data);
  }

  decodeKeyFromData(data: string) {
    return decodeParametersFromData(data, ['address']);
  }

  decodeKeysFromData(data: string) {
    return decodeParametersFromData(data, ['address[]']);
  }

  decodeExecute(data: string) {
    return decodeDataForExecuteSigned(data);
  }

  isValidMessageHash(messageHash: string, signedMessage: SignedMessage) {
    const calculatedMessageHash = this.calculateMessageHash(signedMessage);
    return messageHash === calculatedMessageHash;
  }
}
