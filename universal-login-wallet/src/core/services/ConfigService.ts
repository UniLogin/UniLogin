import UniversalLoginSDK from '@universal-login/sdk';
import {PublicRelayerConfig} from '@universal-login/commons';

export class ConfigService {
  private sdk: UniversalLoginSDK;
  public relayerConfig?: PublicRelayerConfig;

  constructor(sdk: UniversalLoginSDK) {
    this.sdk = sdk;
  }

  async setRelayerConfig() {
    if (!this.relayerConfig) {
      this.relayerConfig = await this.sdk.getRelayerConfig();
    }
  }

  getRelayerConfig() {
    return this.relayerConfig;
  }
}
