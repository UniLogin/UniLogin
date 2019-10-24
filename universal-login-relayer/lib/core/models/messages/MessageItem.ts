import {SignedMessage, CollectedSignatureKeyPair} from '@universal-login/commons';
import {Mineable} from '../Mineable';

export default interface MessageItem extends Mineable {
  collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  walletAddress: string;
  message: SignedMessage;
}
