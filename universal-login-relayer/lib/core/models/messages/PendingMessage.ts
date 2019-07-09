import {CollectedSignatureKeyPair} from '../../services/messages/IPendingMessagesStore';

export default interface PendingMessage {
  collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  transactionHash: string | null;
  error: string | null;
  walletAddress: string;
}
