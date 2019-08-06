import {utils} from 'ethers';

export type ObservedToken = {
  address: string;
};

export type TokenDetail = ObservedToken & {
  symbol: string;
  name: string;
};

export type TokenDetailsWithBalance = TokenDetail & {
  balance: utils.BigNumber;
};
