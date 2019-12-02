import {providers} from 'ethers';

export const ISTANBUL_BLOCK_NUMBER = 9069000;

export const fetchHardforkVersion = async (provider: providers.Provider) => {
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
    case 'homestead':
      const blockNumber = await provider.getBlockNumber();
      if (blockNumber < ISTANBUL_BLOCK_NUMBER) {
        return 'constantinople';
      }
      return 'istanbul';
  }
};
