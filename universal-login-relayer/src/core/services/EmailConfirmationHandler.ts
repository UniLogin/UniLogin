import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {EmailService} from '../../integration/ethereum/EmailService';
import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';

export class EmailConfirmationHandler {
  constructor(
    private emailConfirmationStore: EmailConfirmationsStore,
    private emailService: EmailService,
    private emailValidator: EmailConfirmationValidator,
  ) {}

  async request(email: string, ensName: string) {
    const code = generateValidationCode(6);
    await this.emailConfirmationStore.add({
      email,
      ensName,
      code,
      createdAt: new Date(),
      isConfirmed: false,
    });
    await this.emailService.sendConfirmationMail(email, code);
    return email;
  }

  async confirm(email: string, code: string) {
    return this.emailValidator.validate(email, code);
  }
}

export const generateValidationCode = (codeLength: number) => {
  const code = new Array(codeLength).fill('-');
  return code.map(() => Math.floor(Math.random() * 10)).join('');
};
