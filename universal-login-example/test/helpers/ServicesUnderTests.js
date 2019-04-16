import Services from '../../src/services/Services';
import FakeStorageService from '../fakes/FakeStorageService';

class ServicesUnderTest extends Services {
  static async createPreconfigured(provider, relayer, clickerContractAddress, tokenContractAddress) {
    const {ensAddress} = relayer.config.chainSpec;
    const ensDomains = relayer.config.ensRegistrars;
    const config = {
      jsonRpcUrl: 'http://localhost:8545',
      relayerUrl: relayer.url(),
      ensAddress,
      ensDomains,
      clickerContractAddress,
      tokenContractAddress
    };
    const services = new Services(config, {
      provider,
      storageService: new FakeStorageService()
    });
    return services;
  }
}

export default ServicesUnderTest;
