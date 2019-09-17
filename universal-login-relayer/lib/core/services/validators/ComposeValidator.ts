import {SignedMessage} from '@universal-login/commons';
import IMessageValidator from './IMessageValidator';

export class ComposeValidator implements IMessageValidator {
  constructor(private validators: Array<IMessageValidator>) {}

  validate(signedMessage: SignedMessage) {
    this.validators.forEach((validator) => validator.validate(signedMessage));
  }
}
