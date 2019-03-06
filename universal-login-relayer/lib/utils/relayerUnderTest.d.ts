import {providers} from 'ethers';

declare class RelayerUnderTest extends Relayer {
  url(): string;

  static createPreconfigured(provider: providers.Provider): Promise<Relayer>;
}

export {RelayerUnderTest};