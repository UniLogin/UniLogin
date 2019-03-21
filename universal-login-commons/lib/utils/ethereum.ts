import {utils} from 'ethers';
import {MAX_DECIMAL_PLACES} from '../constants/constants';

export const etherFormatOf = (amount : number) =>
  utils.parseEther(amount.toFixed(MAX_DECIMAL_PLACES));
