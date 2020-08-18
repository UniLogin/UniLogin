import moment from 'moment';
import {ensure, EmailConfirmation} from '@unilogin/commons';
import {UnexpectedConfirmation, InvalidCode, CodeExpired, EmailNotConfirmed} from '../../utils/errors';

export class EmailConfirmationValidator {
  constructor(
    private codeExpirationTimeInMinutes: number = 5,
  ) {}

  isEmailConfirmed(isConfirmed: boolean, email: string) {
    ensure(isConfirmed, EmailNotConfirmed, email);
  }

  validateCode(givenCode: string, storedCode: string) {
    ensure(storedCode === givenCode, InvalidCode, storedCode);
  }

  validate(emailConfirmation: EmailConfirmation, ensNameOrEmail: string, code: string) {
    ensure(!emailConfirmation.isConfirmed, UnexpectedConfirmation, ensNameOrEmail);
    ensure(moment(emailConfirmation.createdAt).add(this.codeExpirationTimeInMinutes, 'm').isAfter(), CodeExpired);
    this.validateCode(emailConfirmation.code, code);
  }
}
