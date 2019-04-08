import ENS from '@universal-login/contracts/build/ENS';
import {providers, Contract, Wallet, utils} from 'ethers';

class ENSRegistrarBase {
  constructor(config, provider, log = console.log) {
    this.provider = provider || new providers.JsonRpcProvider(config.jsonRpcUrl, config.chainSpec);
    this.deployer = new Wallet(config.privateKey, this.provider);
    this.ens = new Contract(config.chainSpec.ensAddress, ENS.interface, this.deployer);
    this.config = config;
    this.variables = {};
    this.log = log;
  }

  async prepareNameRegistration(domain) {
    this.registrarAddress = await this.ens.owner(utils.namehash(domain));
    this.resolverAddress = await this.ens.resolver(utils.namehash(domain));
  }
}

export default ENSRegistrarBase;
