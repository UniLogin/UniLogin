import {providers} from 'ethers';
import {NetworkVersion} from '../../core/utils/messages/computeGasData';

export const ISTANBUL_BLOCK_NUMBER = 9069000;

export const fetchHardforkVersion = async (provider: providers.Provider): Promise<NetworkVersion> => {
  const {name} = await provider.getNetwork();
  switch (name) {
    case 'kovan':
      return 'istanbul';
    case 'ropsten':
      return 'istanbul';
    case 'rinkeby':
      return 'istanbul';
    case 'unknown':
      return 'constantinople';
    case 'ganache':
      return 'constantinople';
    case 'homestead':
    case 'mainnet':
      const blockNumber = await provider.getBlockNumber();
      if (blockNumber < ISTANBUL_BLOCK_NUMBER) {
        return 'constantinople';
      }
      return 'istanbul';
    default:
      throw TypeError(`Invalid network: ${name}`);
  }
};
