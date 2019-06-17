export interface SupportedToken {
  address: string;
  minimalAmount: string;
}

export interface ChainSpec {
  ensAddress: string;
  chainId: number;
  name: string;
}

export interface ContractWhiteList {
  master: string[];
  proxy: string[];
}

export interface PublicRelayerConfig {
  supportedTokens: SupportedToken[];
  factoryAddress: string;
  chainSpec: ChainSpec;
}
