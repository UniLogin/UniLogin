import {utils} from 'ethers';
import {BigNumberish} from 'ethers/utils';
import {safeMultiply} from '@universal-login/commons';
import {formatCurrency} from './formatCurrency';

export const calculateTransactionFeeInUSD = (usdAmount: BigNumberish, gasLimit: BigNumberish) =>
  formatCurrency(safeMultiply(utils.parseEther(usdAmount.toString()), gasLimit));
