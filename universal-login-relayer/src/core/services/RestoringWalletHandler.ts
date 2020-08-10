import {StoredEncryptedWallet} from '@unilogin/commons';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';

export class RestoringWalletHandler {
  constructor(
    private emailConfirmationStore: EmailConfirmationsStore,
    private emailConfirmationValidator: EmailConfirmationValidator,
    private encryptedWalletsStore: EncryptedWalletsStore) {
  }

  async handle(email: string, code: string): Promise<StoredEncryptedWallet> {
    const emailConfirmation = await this.emailConfirmationStore.get(email);
    this.emailConfirmationValidator.validate(emailConfirmation, email, code);
    this.emailConfirmationStore.updateIsConfirmed(emailConfirmation, true);
    return this.encryptedWalletsStore.get(email);
  }
}
