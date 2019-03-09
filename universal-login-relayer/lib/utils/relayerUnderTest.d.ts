import {providers} from 'ethers';
import Relayer from '../../types.d.ts';

declare class RelayerUnderTest extends Relayer {
  url(): string;

  static createPreconfigured(provider?: providers.Provider): Promise<Relayer>;
}

export {RelayerUnderTest};