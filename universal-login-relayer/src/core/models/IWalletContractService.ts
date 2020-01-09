import {SignedMessage, RelayerRequest} from '@universal-login/commons';
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
  messageToTransaction: (message: SignedMessage) => Promise<TransactionRequest> | TransactionRequest;
}
