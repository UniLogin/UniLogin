import {utils} from 'ethers';
import {bigNumberMax, WalletService, InvalidWalletState} from '@unilogin/sdk';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {getPriceInEther} from './getPriceInEther';
import {ValueRounder, TokenPricesService, TokenDetails, ETHER_NATIVE_TOKEN, safeDivide} from '@unilogin/commons';

export interface MinimalAmounts {
  generalMinimalAmount: string;
  minimalAmountForRevolut?: string;
};

export const getMinimalAmountForFiatProvider = async (
  paymentMethod: TopUpProvider,
  requiredDeploymentBalance: string,
  tokenPricesService: TokenPricesService,
  currencyDetails = ETHER_NATIVE_TOKEN,
): Promise<MinimalAmounts> => {
  switch (paymentMethod) {
    case TopUpProvider.RAMP: {
      const fiatCurrency = 'EUR';
      const currencyPriceInEth = await tokenPricesService.getTokenPriceInEth(currencyDetails);
      const providerMinimalAmountInToken = await convertCurrencyToToken('0.6', currencyPriceInEth, fiatCurrency, tokenPricesService);
      const providerMinimalAmountForRevolutInToken = await convertCurrencyToToken('2', currencyPriceInEth, fiatCurrency, tokenPricesService);
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      const biggerAmount = bigNumberMax(requiredDeploymentBalanceAsBigNumber, providerMinimalAmountInToken);
      const biggerAmountForRevolut = bigNumberMax(requiredDeploymentBalanceAsBigNumber, providerMinimalAmountForRevolutInToken);
      return {
        generalMinimalAmount: ValueRounder.ceil(utils.formatEther(biggerAmount)),
        minimalAmountForRevolut: ValueRounder.ceil(utils.formatEther(biggerAmountForRevolut)),
      } as MinimalAmounts;
    }
    case TopUpProvider.SAFELLO:
      return {generalMinimalAmount: '30'};
    default:
      return {generalMinimalAmount: ValueRounder.ceil(requiredDeploymentBalance)};
  }
};

const convertCurrencyToToken = async (amount: string, currencyPriceInEth: number, fiatCurrency: 'EUR' | 'USD' | 'GBP', tokenPricesService: TokenPricesService) => {
  const etherPriceInCurrency = (await tokenPricesService.getEtherPriceInCurrency(fiatCurrency)).toString();
  const providerMinimalAmount = getPriceInEther(amount, etherPriceInCurrency);
  return safeDivide(providerMinimalAmount, currencyPriceInEth);
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
