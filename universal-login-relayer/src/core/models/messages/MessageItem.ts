import {SignedMessage, CollectedSignatureKeyPair} from '@unilogin/commons';
import {Mineable} from '../Mineable';

export default interface MessageItem extends Mineable {
  collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  walletAddress: string;
  message: SignedMessage;
  refundPayerId: string | null;
  tokenPriceInEth: string;
}
