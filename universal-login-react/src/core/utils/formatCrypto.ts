import {utils} from 'ethers';

export const formatCrypto = (crypto: string, places: number) => {
  const base = utils.bigNumberify(10).pow(places);
  return utils.formatEther(utils.bigNumberify(crypto).div(base).mul(base));
};
