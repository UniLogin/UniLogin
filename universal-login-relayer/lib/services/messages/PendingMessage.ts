import {CollectedSignatureKeyPair} from './IPendingMessagesStore';

export default interface PendingMessage {
  collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  transactionHash: string;
  walletAddress: string;
}
