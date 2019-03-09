import {providers} from 'ethers';
import Knex from 'knex';

declare interface RelayerConfig {
  legacyENS: boolean;
  jsonRpcUrl: string;
  port: string;
  privateKey: string;
  chainSpec: {
    ensAddress: string;
    chainId: number;
  },
  ensRegistrars: string[];
}

declare class Relayer {
  provider: providers.Provider;
  database: Knex;

  constructor(config: RelayerConfig, provider?: providers.Provider);

  start(): void;

  runServer(): void;

  stop(): void;
}

export default Relayer;
