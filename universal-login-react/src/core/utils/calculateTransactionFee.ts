import {utils} from 'ethers';
import {BigNumberish} from 'ethers/utils';
import {safeMultiply} from '@unilogin/commons';
import {formatCurrency} from './formatCurrency';

export const calculateTransactionFee = (gasPrice: BigNumberish, gasLimit: BigNumberish) =>
  formatCurrency(safeMultiply(utils.parseEther(gasPrice.toString()), gasLimit));
