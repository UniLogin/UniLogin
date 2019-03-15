import {providers} from 'ethers';
import Relayer from '../../types.d.ts';

declare interface Overrides {
  overridePort?: number;
}

declare class RelayerUnderTest extends Relayer {
  url(): string;

  static createPreconfigured(provider?: providers.Provider, overrides?: Overrides): Promise<Relayer>;
}

export {RelayerUnderTest};