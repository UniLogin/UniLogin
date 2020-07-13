import {ensure, EncryptedWallet} from '@unilogin/commons';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {EmailNotConfirmed} from '../utils/errors';

export class EncryptedWalletHandler {
  constructor(private emailConfirmationsStore: EmailConfirmationsStore, private encryptedWalletsStore: EncryptedWalletsStore) {
  }

  async handle(encryptedWallet: EncryptedWallet) {
    const emailConfirmation = await this.emailConfirmationsStore.get(encryptedWallet.email);
    ensure(emailConfirmation.isConfirmed, EmailNotConfirmed, encryptedWallet.email);
    return this.encryptedWalletsStore.add(encryptedWallet);
  }
}
