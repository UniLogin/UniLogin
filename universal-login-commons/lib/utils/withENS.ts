import {utils, providers} from 'ethers';

export const withENS = (provider : providers.Web3Provider, ensAddress : string) => {
  const chainOptions = {name: 'ganache', ensAddress, chainId: 0} as utils.Network;
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};
