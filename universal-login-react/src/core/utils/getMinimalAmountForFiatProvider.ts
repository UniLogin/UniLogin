import {utils} from 'ethers';
import {bigNumberMax, WalletService, InvalidWalletState} from '@unilogin/sdk';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {getPriceInEther} from './getPriceInEther';
import {ValueRounder, TokenPricesService, TokenDetails, ETHER_NATIVE_TOKEN, safeDivide} from '@unilogin/commons';

export const getMinimalAmountForFiatProvider = async (
  paymentMethod: TopUpProvider,
  requiredDeploymentBalance: string,
  tokenPricesService: TokenPricesService,
  currencyDetails = ETHER_NATIVE_TOKEN,
) => {
  switch (paymentMethod) {
    case TopUpProvider.RAMP: {
      const currencyPriceInEth = await tokenPricesService.getTokenPriceInEth(currencyDetails);
      const providerMinimalAmountInFiat = ['0.6', '2'];
      const etherPriceInGBP = (await tokenPricesService.getEtherPriceInCurrency('GBP')).toString();
      const providerMinimalAmount = getPriceInEther(providerMinimalAmountInFiat[0], etherPriceInGBP);
      const providerMinimalAmountInToken = safeDivide(providerMinimalAmount, currencyPriceInEth);
      const providerMinimalAmountForRevolut = getPriceInEther(providerMinimalAmountInFiat[1], etherPriceInGBP);
      const providerMinimalAmountForRevolutInToken = safeDivide(providerMinimalAmountForRevolut, currencyPriceInEth);

      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      const biggerAmounts = [
        bigNumberMax(
          requiredDeploymentBalanceAsBigNumber,
          providerMinimalAmountInToken,
        ),
        bigNumberMax(
          requiredDeploymentBalanceAsBigNumber,
          providerMinimalAmountForRevolutInToken,
        ),
      ];
      return [ValueRounder.ceil(utils.formatEther(biggerAmounts[0])), ValueRounder.ceil(utils.formatEther(biggerAmounts[1]))];
    }
    case TopUpProvider.SAFELLO:
      return '30';
    default:
      return ValueRounder.ceil(requiredDeploymentBalance);
  }
};

export const getMinimalAmount = (walletService: WalletService, paymentMethod: TopUpProvider, tokenPricesService: TokenPricesService, currencyDetails?: TokenDetails) => {
  if (walletService.isKind('Future')) {
    const requiredDeploymentBalance = walletService.getRequiredDeploymentBalance();
    return getMinimalAmountForFiatProvider(paymentMethod, requiredDeploymentBalance, tokenPricesService, currencyDetails);
  } else if (walletService.isKind('Deployed')) {
    return getMinimalAmountForFiatProvider(paymentMethod, '0', tokenPricesService, currencyDetails);
  }
  throw new InvalidWalletState('Future or Deployed', walletService.state.kind);
};
