export interface SupportedToken {
  address: string;
  minimalAmount: string;
}

export type ChainSpec = {
  ensAddress: string,
  chainId: number,
  name: string
};

export type PublicRelayerConfig = {
  supportedTokens: SupportedToken[];
  factoryAddress: string;
  chainSpec: ChainSpec;
};
