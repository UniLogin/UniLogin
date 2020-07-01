import {utils, constants} from 'ethers';

export const ETHER_NATIVE_TOKEN = {
  address: constants.AddressZero,
  symbol: 'ETH',
  name: 'ether',
  decimals: 18,
};

export const EMPTY_DATA = utils.formatBytes32String('0');

export const ONE_SIGNATURE_GAS_COST = utils.bigNumberify('4420');

export const CURRENT_WALLET_VERSION = 'beta2';

export const CURRENT_NETWORK_VERSION = 'constantinople';
