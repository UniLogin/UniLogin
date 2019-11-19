import {providers, utils} from 'ethers';
import {ensure, IMessageValidator, PaymentOptions, SignedMessage, NotEnoughTokens} from '../../..';
import {BalanceChecker} from '../BalanceChecker';

export const hasEnoughToken = async ({gasToken, gasPrice, gasLimit}: PaymentOptions, walletContractAddress: string, balanceChecker: BalanceChecker) => {
  const balance = await balanceChecker.getBalance(walletContractAddress, gasToken);
  return balance.gte(utils.bigNumberify(gasLimit).mul(gasPrice));
};

export class SufficientBalanceValidator implements IMessageValidator {
  private balanceChecker: BalanceChecker;

  constructor(private provider: providers.Provider) {
    this.balanceChecker = new BalanceChecker(this.provider);
  }

  async validate(signedMessage: SignedMessage) {
    const paymentOptions: PaymentOptions = {
      gasToken: signedMessage.gasToken,
      gasLimit: utils.bigNumberify(signedMessage.gasCall).add(signedMessage.gasData),
      gasPrice: signedMessage.gasPrice,
    };
    ensure(await hasEnoughToken(paymentOptions, signedMessage.from, this.balanceChecker), NotEnoughTokens);
  }
}
