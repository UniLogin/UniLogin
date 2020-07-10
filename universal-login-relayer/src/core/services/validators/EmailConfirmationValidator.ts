import moment from 'moment';
import {ensureNotFalsy, ensure} from '@unilogin/commons';
import {EmailConfirmationsStore} from '../../../integration/sql/services/EmailConfirmationsStore';
import {DuplicatedEmailConfirmation, EmailNotFound, InvalidCode, CodeExpired} from '../../utils/errors';

export class EmailConfirmationValidator {
  constructor(
    private emailConfirmationsStore: EmailConfirmationsStore,
    private codeDurationInMinutes: number = 5,
  ) {}

  async validate(email: string, code: string) {
    const emailConfirmation = await this.emailConfirmationsStore.get(email);
    ensureNotFalsy(emailConfirmation, EmailNotFound, email);
    ensure(!emailConfirmation.isConfirmed, DuplicatedEmailConfirmation, email);
    ensure(moment(emailConfirmation.createdAt).add(this.codeDurationInMinutes, 'm').isAfter(), CodeExpired);
    ensure(code === emailConfirmation.code, InvalidCode, code);
  }
}
