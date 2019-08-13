import {utils} from 'ethers';

export type ObservedToken = {
  address: string;
};

export type TokenDetails = ObservedToken & {
  symbol: string;
  name: string;
};

export type TokenDetailsWithBalance = TokenDetails & {
  balance: utils.BigNumber;
};
