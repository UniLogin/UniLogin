import {providers} from 'ethers';
import {ensureNotNull} from '../../core/utils/errors/heplers';

export const ISTANBUL_BLOCK_NUMBER = 9069000;

export const fetchHardforkVersion = async (network: string, provider?: providers.Provider) => {
  switch (network) {
    case 'kovan':
      return 'istanbul';
    case 'ropsten':
      return 'istanbul';
    case 'rinkeby':
      return 'istanbul';
    case 'mainnet':
      ensureNotNull(provider, TypeError, 'Provider is missing');
      const blockNumber = await provider.getBlockNumber();
      if (blockNumber < ISTANBUL_BLOCK_NUMBER) {return 'constantinople';}
      return 'istanbul';
  }
};
