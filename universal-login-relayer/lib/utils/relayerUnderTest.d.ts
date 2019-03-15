import {providers} from 'ethers';
import Relayer from '../../types.d.ts';

declare interface Overrides {
  overridePort?: number;
  provider?: providers.Provider;
}

declare class RelayerUnderTest extends Relayer {
  url(): string;

  static createPreconfigured(overrides?: Overrides): Promise<Relayer>;
}

export {RelayerUnderTest};