import {StoredEncryptedWallet} from '@unilogin/commons';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {WalletHandlerBase} from './WalletHandlerBase';

export class EncryptedWalletHandler extends WalletHandlerBase {
  constructor(
    emailConfirmationStore: EmailConfirmationsStore,
    emailConfirmationValidator: EmailConfirmationValidator,
    private encryptedWalletsStore: EncryptedWalletsStore) {
    super(emailConfirmationStore, emailConfirmationValidator);
  }

  async handle(storedEncryptedWallet: StoredEncryptedWallet, code: string) {
    const emailConfirmation = await this.getEmailConfirmation(storedEncryptedWallet.email);
    this.isConfirmed(emailConfirmation.isConfirmed, emailConfirmation.email);
    this.validateCode(emailConfirmation.code, code);
    return this.encryptedWalletsStore.add(storedEncryptedWallet);
  }
}
