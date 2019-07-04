import {providers, Contract} from 'ethers';
import ERC20 from '../../contracts/Token.json';
import {ETHER_NATIVE_TOKEN, SupportedToken} from '../..';

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

export const findTokenWithRequiredBalance = async (provider: providers.Provider, supportedTokens: SupportedToken[], contractAddress: string) => {
  for (let i = 0; i < supportedTokens.length; i++) {
    const {address, minimalAmount} = supportedTokens[i];
    const balance = await getBalance(provider, contractAddress, address);
      if (balance.gte(minimalAmount)) {
        return address;
      }
  }
};
