import {ensure} from '@unilogin/commons';
import {AlreadyUsed} from '../utils/errors';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {EmailService} from '../../integration/ethereum/EmailService';
import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';

export class EmailConfirmationHandler {
  constructor(
    private emailConfirmationStore: EmailConfirmationsStore,
    private emailService: EmailService,
    private emailValidator: EmailConfirmationValidator,
    private encryptedWalletStore: EncryptedWalletsStore,
  ) {}

  async requestRestore(ensNameOrEmail: string) {
    const {email, ensName} = await this.encryptedWalletStore.get(ensNameOrEmail);
    return this.request(email, ensName);
  };

  async requestCreating(email: string, ensName: string) {
    ensure(!await this.encryptedWalletStore.exists(email, ensName), AlreadyUsed, `${email} or ${ensName}`);
    return this.request(email, ensName);
  };

  private async request(email: string, ensName: string) {
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

  async confirm(ensNameOrEmail: string, code: string) {
    const emailConfirmation = await this.emailConfirmationStore.get(ensNameOrEmail);
    this.emailValidator.validate(emailConfirmation, ensNameOrEmail, code);
    await this.emailConfirmationStore.updateIsConfirmed(emailConfirmation, true);
  }
}

export const generateValidationCode = (codeLength: number) => {
  const code = new Array(codeLength).fill('-');
  return code.map(() => Math.floor(Math.random() * 10)).join('');
};
