import {SignedMessage, IValidator} from '@universal-login/commons';

export class ComposeValidator implements IValidator {
  constructor(private validators: Array<IValidator>) {}

  async validate(signedMessage: SignedMessage) {
    for (let i = 0; i < this.validators.length; i++) {
      await this.validators[i].validate(signedMessage);
    }
  }
}
