import {utils} from 'ethers';
import {SupportedToken} from '../types/common';

export const normalizeSupportedTokens = (supportedTokens: SupportedToken[]) =>
  supportedTokens.map(
    (supportedToken) => (
      {
        ...supportedToken,
        minimalAmount: utils.bigNumberify(supportedToken.minimalAmount)
      })
  );
