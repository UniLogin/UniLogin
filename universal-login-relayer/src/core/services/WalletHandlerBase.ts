import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';

export abstract class WalletHandlerBase {
  constructor(
    protected emailConfirmationStore: EmailConfirmationsStore,
    protected emailConfirmationValidator: EmailConfirmationValidator) {
  }

  protected async getEmailConfirmation(email: string) {
    return this.emailConfirmationStore.get(email);
  }

  protected validateCode(givenCode: string, code: string) {
    return this.emailConfirmationValidator.validateCode(givenCode, code);
  }

  protected isConfirmed(isConfirmed: boolean, email: string) {
    return this.emailConfirmationValidator.isEmailConfirmed(isConfirmed, email);
  }
}
