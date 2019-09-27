import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from './constants';

export const INITIAL_GAS_PARAMETERS = {
  gasToken: ETHER_NATIVE_TOKEN.address,
  gasPrice: utils.bigNumberify('0')
};

export const EMPTY_GAS_OPTION = {
  token: {
    name: '',
    symbol: '',
    address: ''
  },
  gasPrice: utils.bigNumberify('0')
};
