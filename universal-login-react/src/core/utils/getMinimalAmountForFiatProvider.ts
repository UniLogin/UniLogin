import {utils} from 'ethers';
import {getEtherPriceInCurrency, bigNumberMax, WalletService} from '@unilogin/sdk';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {getPriceInEther} from './getPriceInEther';
import {ValueRounder} from '@unilogin/commons';

export const getMinimalAmountForFiatProvider = async (paymentMethod: TopUpProvider, requiredDeploymentBalance: string) => {
  switch (paymentMethod) {
    case TopUpProvider.RAMP: {
      const providerMinimalAmountInFiat = '1';
      const etherPriceInGBP = (await getEtherPriceInCurrency('GBP')).toString();
      const providerMinimalAmount = getPriceInEther(providerMinimalAmountInFiat, etherPriceInGBP);
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      return ValueRounder.ceil(utils.formatEther(bigNumberMax(
        requiredDeploymentBalanceAsBigNumber,
        providerMinimalAmount,
      )));
    }
    case TopUpProvider.SAFELLO:
      return '30';
    default:
      return requiredDeploymentBalance;
  }
};

export const getMinimalAmount = (walletService: WalletService, paymentMethod: TopUpProvider) => {
  try {
    const requiredDeploymentBalance = walletService.getRequiredDeploymentBalance();
    return getMinimalAmountForFiatProvider(paymentMethod, requiredDeploymentBalance);
  } catch (error) {
    if (error.message === 'Wallet state is Deployed, but expected Future' ||
        error.message === 'this.state.wallet.getMinimalAmount is not a function') {
        return getMinimalAmountForFiatProvider(paymentMethod, '0');
    }
  }
};
