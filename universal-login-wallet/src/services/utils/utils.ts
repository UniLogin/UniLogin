import {providers, Contract} from 'ethers';
const Token = require('openzeppelin-solidity/build/contracts/ERC20Detailed.json');

export const getTokenDetails = async (provider: providers.Provider, address: string) => {
  const token = new Contract(address, Token.abi, provider);
  const symbol = await token.symbol();
  const name = await token.name();
  return {address, name, symbol};
};
