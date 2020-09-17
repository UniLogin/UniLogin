import {StoredEncryptedWallet, StoredFutureWallet} from '@unilogin/commons';
import {EncryptedWalletsStore} from '../../integration/sql/services/EncryptedWalletsStore';
import {EmailConfirmationValidator} from './validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../integration/sql/services/EmailConfirmationsStore';
import {WalletHandlerBase} from './WalletHandlerBase';
import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';

export class RestoreWalletHandler extends WalletHandlerBase {
  constructor(
    emailConfirmationStore: EmailConfirmationsStore,
    emailConfirmationValidator: EmailConfirmationValidator,
    private encryptedWalletsStore: EncryptedWalletsStore,
    private futureWalletStore: FutureWalletStore) {
    super(emailConfirmationStore, emailConfirmationValidator);
  }

  async handle(email: string, code: string): Promise<StoredEncryptedWallet & Pick<StoredFutureWallet, 'gasPrice' | 'gasToken'>> {
    const emailConfirmation = await this.getEmailConfirmation(email);
    this.validate(emailConfirmation, email, code);
    this.markAsConfirmed(emailConfirmation);
    const encryptedWallet = await this.encryptedWalletsStore.get(email);
    const storedFutureWallet = await this.futureWalletStore.getByEnsName(encryptedWallet.ensName);
    return {
      ...encryptedWallet,
      gasToken: storedFutureWallet.gasToken,
      gasPrice: storedFutureWallet.gasPrice,
    };
  }
}
