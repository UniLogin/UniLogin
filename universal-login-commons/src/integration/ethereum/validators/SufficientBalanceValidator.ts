import {providers} from 'ethers';
import {ensure, IMessageValidator, SignedMessage, NotEnoughTokens} from '../../..';
import {BalanceChecker} from '../BalanceChecker';
import {getFeeCurrencyValueFrom} from '../../../core/utils/getFeeCurrencyValueFrom';

export class SufficientBalanceValidator implements IMessageValidator {
  private balanceChecker: BalanceChecker;

  constructor(private provider: providers.Provider) {
    this.balanceChecker = new BalanceChecker(this.provider);
  }

  async validate(signedMessage: SignedMessage) {
    const feeCurrencyValue = getFeeCurrencyValueFrom(signedMessage);
    const balance = await this.balanceChecker.getBalance(signedMessage.from, feeCurrencyValue.address);
    const hasEnoughToken = balance.gte(feeCurrencyValue.value);
    ensure(hasEnoughToken, NotEnoughTokens);
  }
}
