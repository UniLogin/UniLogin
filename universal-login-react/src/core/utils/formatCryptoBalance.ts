import {utils} from 'ethers';

export const formatCryptoBalance = (crypto: string, places: number) => {
  const base = utils.bigNumberify(10).pow(places > 18 ? 0 : 18-places);
  return utils.formatEther(utils.parseEther(crypto).div(base).mul(base));
};
