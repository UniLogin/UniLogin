import {utils} from 'ethers';

export const ETHER_NATIVE_TOKEN = {
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ETH',
  name: 'ether',
};

export const EMPTY_DATA = utils.formatBytes32String('0');

export const ONE_SIGNATURE_GAS_COST = utils.bigNumberify('4420');

export const ACTUAL_WALLET_VERSION = 'beta2';

export const ACTUAL_NETWORK_VERSION = 'constantinople';
