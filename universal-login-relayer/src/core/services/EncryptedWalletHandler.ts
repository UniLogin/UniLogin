import {StoredEncryptedWallet, ensure} from '@unilogin/commons';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {EmailNotConfirmed} from '../utils/errors';

export class EncryptedWalletHandler {
  constructor(private emailConfirmationStore: EmailConfirmationsStore, private emailConfirmationValidator: EmailConfirmationValidator, private encryptedWalletsStore: EncryptedWalletsStore) {
  }

  async handle(storedEncryptedWallet: StoredEncryptedWallet, code: string) {
    const email = storedEncryptedWallet.email;
    const emailConfirmation = await this.emailConfirmationStore.get(email);
    this.emailConfirmationValidator.validateEmail(emailConfirmation);
    this.emailConfirmationValidator.validateCode(emailConfirmation, code);
    return this.encryptedWalletsStore.add(storedEncryptedWallet);
  }
}
