import UniversalLoginSDK from 'universal-login-sdk';

class Services {
  constructor(config) {
    this.config = config;
    this.sdk = new UniversalLoginSDK(this.config.relayerUrl, this.config.jsonRpcUrl);
  }
}

export default Services;