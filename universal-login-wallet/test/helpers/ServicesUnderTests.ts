import {createServices} from '../../src/services/Services';
import {providers} from 'ethers';

class ServicesUnderTest {
  static async createPreconfigured(provider: providers.Provider, relayer: any, tokens: string[]) {
    const domains = relayer.config.ensRegistrars;
    const config = {
      jsonRpcUrl: 'http://localhost:8545',
      relayerUrl: relayer.url(),
      domains,
      tokens
    };
    const services = createServices(config, provider);
    return services;
  }
}

export default ServicesUnderTest;
