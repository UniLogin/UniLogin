import {providers, Contract} from 'ethers';
import ERC20 from '@universal-login/contracts/build/ERC20.json';
import {ETHER_NATIVE_TOKEN} from '..';

export async function getBalance(provider: providers.Provider, contractAddress: string, tokenAddress: string) {
  if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
    return getEtherBalance(provider, contractAddress);
  } else {
    return getTokenBalance(provider, contractAddress, tokenAddress);
  }
}

async function getEtherBalance(provider: providers.Provider, contractAddress: string) {
  return provider.getBalance(contractAddress);
}

async function getTokenBalance(provider: providers.Provider, contractAddress: string, tokenAddress: string) {
  const token = new Contract(tokenAddress, ERC20.interface, provider);
  return token.balanceOf(contractAddress);
}