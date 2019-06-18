import {providers} from 'ethers';
import {getBalance, SupportedToken} from '..';

export const balanceChangedFor = async (provider: providers.Provider, supportedTokens: SupportedToken[], contractAddress: string) => {
  for(let i = 0; i < supportedTokens.length; i++) {
    const {address, minimalAmount} = supportedTokens[i];
    const balance = await getBalance(provider, contractAddress, address);
      if (balance.gte(minimalAmount)) {
        return address;
      }
  }
}
