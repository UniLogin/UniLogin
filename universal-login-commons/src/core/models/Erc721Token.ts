export interface IErc721Token {
  id: string;
  name: string;
  image: string;
  description: string;
  backgroundColor: string;
  tokenName: string;
  externalink: string;
}

export interface IBasicErc721Token {
  tokenID: string;
  contractAddress: string;
}
