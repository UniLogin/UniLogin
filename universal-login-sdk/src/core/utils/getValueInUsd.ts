import {WalletService} from '../services/WalletService';
import {utils} from 'ethers';
import {safeMultiply, ValueRounder, safeMultiplyDecimalsAndFormatEther} from '@unilogin/commons';

export const getValueInUsd = async (tokenAddress: string, walletService: WalletService, value: string, round = 3) => {
  const tokenDetails = await walletService.sdk.tokenDetailsService.getTokenDetails(tokenAddress);
  const tokenPrice = await walletService.sdk.tokenPricesService.getTokenPriceInEth(tokenDetails);
  const etherPriceInUsd = await walletService.sdk.tokenPricesService.getEtherPriceInCurrency('USD');
  const ethValue = safeMultiply(utils.bigNumberify(value), tokenPrice);
  return ValueRounder.ceil(safeMultiplyDecimalsAndFormatEther(ethValue, etherPriceInUsd), round);
};
