import {balanceChangedFor, SupportedToken, ensure} from '@universal-login/commons';
import {providers} from 'ethers';

export const checkBalance = async (provider: providers.Provider, supportedTokens: SupportedToken[], contractAddress: string) => {
  ensure(!!await balanceChangedFor(provider, supportedTokens, contractAddress), Error, 'Balance is too small.');
  return true;
};
