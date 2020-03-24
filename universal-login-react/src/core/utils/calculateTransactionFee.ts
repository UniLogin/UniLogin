import {utils} from 'ethers';
import {BigNumberish} from 'ethers/utils';
import {safeMultiplyAndFormatEther} from '@unilogin/commons';
import {formatCurrency} from './formatCurrency';

export const calculateTransactionFee = (gasPrice: BigNumberish, gasLimit: BigNumberish) =>
  formatCurrency(safeMultiplyAndFormatEther(utils.parseEther(gasPrice.toString()), gasLimit));
