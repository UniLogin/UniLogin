import {ensure, IMessageValidator, SignedMessage, NotEnoughTokens} from '../../..';
import {BalanceChecker} from '../BalanceChecker';
import {getFeeCurrencyValueFrom} from '../../../core/utils/getFeeCurrencyValueFrom';
import {getTransferCurrencyValueFrom} from '../../../core/utils/getTransferCurrencyValueFrom';
import {CurrencyValue} from '../../../core/models/CurrencyValue';
import {ProviderService} from '../ProviderService';

export class SufficientBalanceValidator implements IMessageValidator {
  private balanceChecker: BalanceChecker;

  constructor(providerService: ProviderService) {
    this.balanceChecker = new BalanceChecker(providerService);
  }

  private async ensureEnoughBalance(address: string, currencyValue: CurrencyValue): Promise<void> {
    const balance = await this.balanceChecker.getBalance(address, currencyValue.address);
    ensure(balance.gte(currencyValue.value), NotEnoughTokens);
  }

  async validate(signedMessage: SignedMessage) {
    const feeCurrencyValue = getFeeCurrencyValueFrom(signedMessage);
    const transferCurrencyValue = getTransferCurrencyValueFrom(signedMessage);
    if (transferCurrencyValue) {
      if (transferCurrencyValue.address === feeCurrencyValue.address) {
        const value = transferCurrencyValue.add(feeCurrencyValue);
        await this.ensureEnoughBalance(signedMessage.from, value);
      } else {
        await this.ensureEnoughBalance(signedMessage.from, feeCurrencyValue);
        await this.ensureEnoughBalance(signedMessage.from, transferCurrencyValue);
      }
    } else {
      await this.ensureEnoughBalance(signedMessage.from, feeCurrencyValue);
    }
  }
}
