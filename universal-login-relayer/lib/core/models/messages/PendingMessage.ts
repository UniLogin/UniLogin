import {SignedMessage, MessageState} from '@universal-login/commons';
import {CollectedSignatureKeyPair} from '../../services/messages/IPendingMessagesStore';

export default interface PendingMessage {
  collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  transactionHash: string | null;
  error: string | null;
  walletAddress: string;
  message: SignedMessage | null;
  state: MessageState;
}
