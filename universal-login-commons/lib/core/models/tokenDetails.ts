export type TokenDetails = {
  address: string;
  symbol: string;
  name: string;
};

export type TokenDetailsWithBalance = {
  token: TokenDetails;
  balance: string;
};
