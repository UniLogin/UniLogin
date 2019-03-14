import {createServices} from '../../src/services/Services';
import {providers} from 'ethers';
import {testJsonRpcUrl} from 'universal-login-commons';

class ServicesUnderTest {
  static async createPreconfigured(provider: providers.Provider, relayer: any, tokens: string[]) {
    const domains = relayer.config.ensRegistrars;
    const config = {
      jsonRpcUrl: testJsonRpcUrl,
      relayerUrl: relayer.url(),
      domains,
      tokens
    };
    const services = createServices(config, provider);
    return services;
  }
}

export default ServicesUnderTest;
