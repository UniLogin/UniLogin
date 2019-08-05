import {utils} from 'ethers';

export type TokenDetails = {
  address: string;
  symbol: string;
  name: string;
};

export type TokenDetailsWithBalance = TokenDetails & {
  balance: utils.BigNumber;
};
