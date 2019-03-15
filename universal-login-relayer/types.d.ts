import {providers, Wallet} from 'ethers';
import Knex from 'knex';
import {EventEmitter} from 'fbemitter';

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
  wallet: Wallet;
  hooks: EventEmitter;

  constructor(config: RelayerConfig, provider?: providers.Provider);

  start(): void;

  runServer(): void;

  stop(): void;
}

export default Relayer;

export {RelayerConfig};
