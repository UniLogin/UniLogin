import {IMessageValidator, SignedMessage, ensure} from '@unilogin/commons';
import {InvalidRefundReceiver} from '../../utils/errors';

export class RefundReceiverValidator implements IMessageValidator {
  constructor(private walletAddress: string) {
  }

  validate(signedMessage: SignedMessage) {
    ensure(this.walletAddress === signedMessage.refundReceiver, InvalidRefundReceiver, `Expected address: ${this.walletAddress}`);
  }
}
