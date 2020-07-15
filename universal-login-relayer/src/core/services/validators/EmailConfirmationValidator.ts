import moment from 'moment';
import {ensure, EmailConfirmation} from '@unilogin/commons';
import {DuplicatedEmailConfirmation, InvalidCode, CodeExpired, EmailNotConfirmed} from '../../utils/errors';

export class EmailConfirmationValidator {
  constructor(
    private codeDurationInMinutes: number = 5,
  ) {}

  isEmailConfirmed(emailConfirmation: EmailConfirmation) {
    ensure(emailConfirmation.isConfirmed, EmailNotConfirmed, emailConfirmation.email);
  }

  validateCode(emailConfirmation: EmailConfirmation, code: string) {
    ensure(code === emailConfirmation.code, InvalidCode, code);
  }

  validate(emailConfirmation: EmailConfirmation, email: string, code: string) {
    ensure(!emailConfirmation.isConfirmed, DuplicatedEmailConfirmation, email);
    ensure(moment(emailConfirmation.createdAt).add(this.codeDurationInMinutes, 'm').isAfter(), CodeExpired);
    this.validateCode(emailConfirmation, code);
  }
}
