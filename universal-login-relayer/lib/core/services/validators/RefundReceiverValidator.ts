import {IMessageValidator, SignedMessage, ensure} from '@universal-login/commons';
import {Wallet} from 'ethers';
import {InvalidRefundReceiver} from '../../utils/errors';

export class RefundReceiverValidator implements IMessageValidator {
  constructor(private wallet: Wallet){
  }

  validate(signedMessage: SignedMessage) {
    ensure(this.wallet.address === signedMessage.refundReceiver, InvalidRefundReceiver, `Expected address: ${this.wallet.address}`);
  }
}