import {EmailConfirmationsStore} from '../../../integration/sql/services/EmailConfirmationsStore';
import {ensureNotFalsy, ensure} from '@unilogin/commons';
import {DuplicatedEmail, EmailNotFound} from '../../utils/errors';

export class EmailConfirmationValidator {
  constructor(
    private emailConfirmationsStore: EmailConfirmationsStore,
  ) {}

  async validate(email: string) {
    const emailConfirmation = await this.emailConfirmationsStore.get(email);
    ensureNotFalsy(emailConfirmation, EmailNotFound, email);
    ensure(!emailConfirmation.isConfirmed, DuplicatedEmail, email);
  }
}
