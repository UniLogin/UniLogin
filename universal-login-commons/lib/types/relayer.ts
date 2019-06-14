import {utils} from 'ethers';

export interface SupportedToken {
  address: string;
  minimalAmount: utils.BigNumber;
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
