import {SignedMessage, CollectedSignatureKeyPair} from '@universal-login/commons';
import {RepositoryItem} from '../RepositoryItem';

export default interface MessageItem extends RepositoryItem {
  collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  walletAddress: string;
  message: SignedMessage;
}
