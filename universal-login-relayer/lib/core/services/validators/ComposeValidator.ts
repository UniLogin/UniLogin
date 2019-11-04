import {SignedMessage} from '@universal-login/commons';
import IValidator from '../../models/IValidator';

export class ComposeValidator implements IValidator {
  constructor(private validators: Array<IValidator>) {}

  async validate(signedMessage: SignedMessage) {
    for (let i = 0; i < this.validators.length; i++) {
      await this.validators[i].validate(signedMessage);
    }
  }
}
