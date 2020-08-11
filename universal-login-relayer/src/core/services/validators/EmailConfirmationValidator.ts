import moment from 'moment';
import {ensure, EmailConfirmation} from '@unilogin/commons';
import {UnexpectedConfirmation, InvalidCode, CodeExpired, EmailNotConfirmed} from '../../utils/errors';

export class EmailConfirmationValidator {
  constructor(
    private codeDurationInMinutes: number = 5,
  ) {}

  isEmailConfirmed(isConfirmed: boolean, email: string) {
    ensure(isConfirmed, EmailNotConfirmed, email);
  }

  validateCode(givenCode: string, storedCode: string) {
    ensure(storedCode === givenCode, InvalidCode, storedCode);
  }

  validate(emailConfirmation: EmailConfirmation, email: string, code: string) {
    ensure(!emailConfirmation.isConfirmed, UnexpectedConfirmation, email);
    ensure(moment(emailConfirmation.createdAt).add(this.codeDurationInMinutes, 'm').isAfter(), CodeExpired);
    this.validateCode(emailConfirmation.code, code);
  }
}
