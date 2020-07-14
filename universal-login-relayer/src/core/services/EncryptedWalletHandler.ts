import {StoredEncryptedWallet} from '@unilogin/commons';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {EmailConfirmationHandler} from './EmailConfirmationHandler';

export class EncryptedWalletHandler {
  constructor(private emailConfirmationHandler: EmailConfirmationHandler, private encryptedWalletsStore: EncryptedWalletsStore) {
  }

  async handle(storedEncryptedWallet: StoredEncryptedWallet, code: string) {
    await this.emailConfirmationHandler.confirm(storedEncryptedWallet.email, code);
    return this.encryptedWalletsStore.add(storedEncryptedWallet);
  }
}
