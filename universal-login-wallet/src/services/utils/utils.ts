import {providers, Contract} from 'ethers';

const tokenAbi = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
];

export const getTokenDetails = async (provider: providers.Provider, address: string) => {
  const token = new Contract(address, tokenAbi, provider);
  const symbol = await token.symbol();
  const name = await token.name();
  return {address, name, symbol};
};
