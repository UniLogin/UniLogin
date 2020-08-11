import {StoredEncryptedWallet} from '@unilogin/commons';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {WalletHandlerBase} from './WalletHandlerBase';

export class RestoringWalletHandler extends WalletHandlerBase {
  constructor(
    emailConfirmationStore: EmailConfirmationsStore,
    emailConfirmationValidator: EmailConfirmationValidator,
    private encryptedWalletsStore: EncryptedWalletsStore) {
    super(emailConfirmationStore, emailConfirmationValidator);
  }

  async handle(email: string, code: string): Promise<StoredEncryptedWallet> {
    const emailConfirmation = await this.getEmailConfirmation(email);
    this.validate(emailConfirmation, email, code);
    this.updateIsConfirmed(emailConfirmation);
    return this.encryptedWalletsStore.get(email);
  }
}
