import moment from 'moment';
import {ensure, EmailConfirmation} from '@unilogin/commons';
import {DuplicatedEmailConfirmation, InvalidCode, CodeExpired} from '../../utils/errors';

export class EmailConfirmationValidator {
  constructor(
    private codeDurationInMinutes: number = 5,
  ) {}

  async validate(emailConfirmation: EmailConfirmation, email: string, code: string) {
    ensure(!emailConfirmation.isConfirmed, DuplicatedEmailConfirmation, email);
    ensure(moment(emailConfirmation.createdAt).add(this.codeDurationInMinutes, 'm').isAfter(), CodeExpired);
    ensure(code === emailConfirmation.code, InvalidCode, code);
  }
}
