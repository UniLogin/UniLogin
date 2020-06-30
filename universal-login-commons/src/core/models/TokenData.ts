import {utils} from 'ethers';

export type TokenDetails = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
};

export type TokenDetailsWithBalance = TokenDetails & {
  balance: utils.BigNumber;
};
