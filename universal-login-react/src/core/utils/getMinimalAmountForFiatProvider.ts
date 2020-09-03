import {utils} from 'ethers';
import {bigNumberMax, WalletService, InvalidWalletState} from '@unilogin/sdk';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {getPriceInEther} from './getPriceInEther';
import {ValueRounder, TokenPricesService, TokenDetails, ETHER_NATIVE_TOKEN, safeDivide} from '@unilogin/commons';
import {BigNumber} from 'ethers/utils';

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
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      return {
        generalMinimalAmount: await getMinimalAmountForRamp('0.6', requiredDeploymentBalanceAsBigNumber, currencyPriceInEth, fiatCurrency, tokenPricesService),
        minimalAmountForRevolut: await getMinimalAmountForRamp('2', requiredDeploymentBalanceAsBigNumber, currencyPriceInEth, fiatCurrency, tokenPricesService),
      } as MinimalAmounts;
    }
    case TopUpProvider.SAFELLO:
      return {generalMinimalAmount: '30'};
    default:
      return {generalMinimalAmount: ValueRounder.ceil(requiredDeploymentBalance)};
  }
};

const getMinimalAmountForRamp = async (amount: string, requiredDeploymentBalanceAsBigNumber: BigNumber, currencyPriceInEth: number, fiatCurrency: 'EUR' | 'USD' | 'GBP', tokenPricesService: TokenPricesService) => {
  const providerMinimalAmountInToken = await convertCurrencyToToken(amount, currencyPriceInEth, fiatCurrency, tokenPricesService);
  const biggerAmount = bigNumberMax(requiredDeploymentBalanceAsBigNumber, providerMinimalAmountInToken);
  return ValueRounder.ceil(utils.formatEther(biggerAmount));
};

const convertCurrencyToToken = async (amount: string, currencyPriceInEth: number, fiatCurrency: 'EUR' | 'USD' | 'GBP', tokenPricesService: TokenPricesService) => {
  const etherPriceInCurrency = (await tokenPricesService.getEtherPriceInCurrency(fiatCurrency)).toString();
  const priceInEth = getPriceInEther(amount, etherPriceInCurrency);
  return safeDivide(priceInEth, currencyPriceInEth);
};

export const getMinimalAmount = (walletService: WalletService, paymentMethod: TopUpProvider, tokenPricesService: TokenPricesService, currencyDetails?: TokenDetails) => {
  if (walletService.isKind('Future')) {
    const requiredDeploymentBalance = walletService.getRequiredDeploymentBalance();
    return getMinimalAmountForFiatProvider(paymentMethod, requiredDeploymentBalance, tokenPricesService, currencyDetails);
  } else if (walletService.isDeployed()) {
    return getMinimalAmountForFiatProvider(paymentMethod, '0', tokenPricesService, currencyDetails);
  }
  throw new InvalidWalletState('Future or Deployed', walletService.state.kind);
};
