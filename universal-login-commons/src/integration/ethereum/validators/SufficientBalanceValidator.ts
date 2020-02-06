import {providers} from 'ethers';
import {ensure, IMessageValidator, SignedMessage, NotEnoughTokens} from '../../..';
import {BalanceChecker} from '../BalanceChecker';
import {getFeeCurrencyValueFrom} from '../../../core/utils/getFeeCurrencyValueFrom';
import {getTransferCurrencyValueFrom} from '../../../core/utils/getTransferCurrencyValueFrom';
import {CurrencyValue} from '../../../core/models/CurrencyValue';

export class SufficientBalanceValidator implements IMessageValidator {
  private balanceChecker: BalanceChecker;

  constructor(private provider: providers.Provider) {
    this.balanceChecker = new BalanceChecker(this.provider);
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
        const value = transferCurrencyValue.value.add(feeCurrencyValue.value);
        await this.ensureEnoughBalance(signedMessage.from, {value, address: feeCurrencyValue.address});
      } else {
        await this.ensureEnoughBalance(signedMessage.from, feeCurrencyValue);
        await this.ensureEnoughBalance(signedMessage.from, transferCurrencyValue);
      }
    } else {
      await this.ensureEnoughBalance(signedMessage.from, feeCurrencyValue);
    }
  }
}
