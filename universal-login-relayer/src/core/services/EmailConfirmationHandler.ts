import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';

export class EmailConfirmationHandler {
  constructor(
    private emailConfirmationStore: EmailConfirmationsStore,
  ) {}

  handle(email: string, ensName: string) {
    const emailConfirmation = {
      email,
      ensName,
      code: generateValidationCode(6),
      createdAt: new Date(),
      isConfirmed: false,
    };
    return this.emailConfirmationStore.add(emailConfirmation);
  }
}

export const generateValidationCode = (codeLength: number) => {
  const code = new Array(codeLength).fill('-');
  return code.map(() => Math.floor(Math.random() * 10)).join('');
};
