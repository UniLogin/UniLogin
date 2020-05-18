import {SignedMessage, RelayerRequest, DecodedMessage, DecodedMessageGnosis} from '@unilogin/commons';
import {utils} from 'ethers';
import {TransactionRequest} from 'ethers/providers';

export default interface IWalletContractService {
  keyExist: (walletAddress: string, key: string) => Promise<boolean>;
  calculateMessageHash: (message: SignedMessage) => Promise<string> | string;
  recoverSignerFromMessage: (message: SignedMessage) => Promise<string> | string;
  getRequiredSignatures: (walletAddress: string) => Promise<utils.BigNumber>;
  fetchMasterAddress: (walletAddress: string) => Promise<string>;
  isValidSignature: (message: string, walletAddress: string, signature: string) => Promise<string>;
  getRelayerRequestMessage: (relayerRequest: RelayerRequest) => Promise<string> | string;
  recoverFromRelayerRequest: (relayerRequest: RelayerRequest) => Promise<string> | string;
  messageToTransaction: (message: SignedMessage, tokenGasPriceInEth: utils.BigNumberish) => Promise<TransactionRequest>;
  isAddKeyCall: (data: string) => boolean;
  isAddKeysCall: (data: string) => boolean;
  isRemoveKeyCall: (data: string) => boolean;
  decodeKeyFromData: (data: string) => string[];
  decodeKeysFromData: (data: string) => string[];
  decodeExecute: (data: string) => DecodedMessage | DecodedMessageGnosis;
  isValidMessageHash: (messageHash: string, signedMessage: SignedMessage) => boolean;
}
