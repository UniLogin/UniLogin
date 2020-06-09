import {utils, constants} from 'ethers';

export const ETHER_NATIVE_TOKEN = {
  address: constants.AddressZero,
  symbol: 'ETH',
  name: 'ether',
};

export const EMPTY_DATA = utils.formatBytes32String('0');

export const ONE_SIGNATURE_GAS_COST = utils.bigNumberify('4420');

export const CURRENT_WALLET_VERSION = 'beta2';

export const CURRENT_NETWORK_VERSION = 'constantinople';

export const OPENSEA_API_HTTP = 'https://api.opensea.io/api/v1/asset';

export const ETHERSCAN_API_HTTP = 'http://api.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=51GC96WCST6YU1BKYWGGX3PIT21UJPTFTE';
