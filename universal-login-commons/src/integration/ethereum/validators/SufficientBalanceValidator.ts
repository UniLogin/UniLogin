import {providers, utils} from 'ethers';
import {ensure, IMessageValidator, PaymentOptions, SignedMessage, NotEnoughTokens} from '../../..';
import {BalanceChecker} from '../BalanceChecker';
import {getGasToken} from '../../../core/utils/getGasToken';

export const hasEnoughToken = async ({gasToken, gasPrice, gasLimit}: Omit<PaymentOptions, 'refundReceiver'>, walletContractAddress: string, balanceChecker: BalanceChecker) => {
  const balance = await balanceChecker.getBalance(walletContractAddress, gasToken);
  return balance.gte(utils.bigNumberify(gasLimit).mul(gasPrice));
};

export class SufficientBalanceValidator implements IMessageValidator {
  private balanceChecker: BalanceChecker;

  constructor(private provider: providers.Provider) {
    this.balanceChecker = new BalanceChecker(this.provider);
  }

  async validate(signedMessage: SignedMessage) {
    const gasTokenDetails = getGasToken(signedMessage);
    const balance = await this.balanceChecker.getBalance(signedMessage.from, gasTokenDetails.address);
    const hasEnoughToken = balance.gte(gasTokenDetails.balance);
    ensure(hasEnoughToken, NotEnoughTokens);
  }
}
