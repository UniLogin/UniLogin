import UniversalLoginSDK from '@universal-login/sdk';
import {PublicRelayerConfig} from '@universal-login/commons';

export class ConfigService {
  private sdk: UniversalLoginSDK;
  public relayerConfig?: PublicRelayerConfig;

  constructor(sdk: UniversalLoginSDK) {
    this.sdk = sdk;
  }

  async fetchRelayerConfig() {
    if (!this.relayerConfig) {
      this.relayerConfig = await this.sdk.getRelayerConfig();
    }
  }

  async getRelayerConfig() {
    await this.fetchRelayerConfig();
    return this.relayerConfig;
  }
}
