import {utils} from 'ethers';
import {bigNumberMax, WalletService, InvalidWalletState} from '@unilogin/sdk';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {getPriceInEther} from './getPriceInEther';
import {ValueRounder, TokenPricesService, TokenDetails, ETHER_NATIVE_TOKEN} from '@unilogin/commons';

const calculateAmountInCurrency = (amount: string, currencyPriceInEth: number) => {
  const amountInEth = parseFloat(amount);
  return (amountInEth * currencyPriceInEth).toString();
};

export const getMinimalAmountForFiatProvider = async (
  paymentMethod: TopUpProvider,
  requiredDeploymentBalance: string,
  tokenPricesService: TokenPricesService,
  currencyDetails?: TokenDetails,
) => {
  currencyDetails = currencyDetails || ETHER_NATIVE_TOKEN;
  const currencyPriceInEth = await tokenPricesService.getTokenPriceInEth(currencyDetails);
  switch (paymentMethod) {
    case TopUpProvider.RAMP: {
      const providerMinimalAmountInFiat = '1';
      const etherPriceInGBP = (await tokenPricesService.getEtherPriceInCurrency('GBP')).toString();
      const providerMinimalAmount = getPriceInEther(providerMinimalAmountInFiat, etherPriceInGBP);
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      const biggerAmout = utils.formatEther(bigNumberMax(
        requiredDeploymentBalanceAsBigNumber,
        providerMinimalAmount,
      ));
      return ValueRounder.ceil(calculateAmountInCurrency(biggerAmout, currencyPriceInEth));
    }
    case TopUpProvider.SAFELLO:
      return '30';
    default:
      return ValueRounder.ceil(calculateAmountInCurrency(requiredDeploymentBalance, currencyPriceInEth));
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
