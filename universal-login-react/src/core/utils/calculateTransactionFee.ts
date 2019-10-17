import {utils} from 'ethers';
import {BigNumberish} from 'ethers/utils';
import {safeMultiply} from '@universal-login/commons';
import {formatCurrency} from './formatCurrency';

export const calculateTransactionFee = (gasPrice: BigNumberish, gasLimit: BigNumberish) =>
  formatCurrency(safeMultiply(utils.parseEther(gasPrice.toString()), gasLimit));
