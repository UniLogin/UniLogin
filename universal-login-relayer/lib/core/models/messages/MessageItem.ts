import {SignedMessage, MessageState, CollectedSignatureKeyPair} from '@universal-login/commons';

export default interface MessageItem {
  collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  transactionHash: string | null;
  error: string | null;
  walletAddress: string;
  message: SignedMessage;
  state: MessageState;
}
