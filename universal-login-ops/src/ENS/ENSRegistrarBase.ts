import {providers, Contract, Wallet, utils, ContractFunction} from 'ethers';
import ENS from '@universal-login/contracts/build/ENS.json';
import {Config} from './config';

class ENSRegistrarBase {
  protected readonly deployer : Wallet;
  protected ens : Contract;
  protected variables : Record<string, string>;
  protected registrarAddress: ContractFunction | any;
  protected resolverAddress: ContractFunction | any;
  protected provider: providers.Provider;

  constructor(protected config: Config, provider?: providers.Provider, protected log: any = console.log) {
    this.provider = provider || new providers.JsonRpcProvider(config.jsonRpcUrl, config.chainSpec);
    this.deployer = new Wallet(config.privateKey, this.provider);
    this.ens = new Contract(config.chainSpec.ensAddress, ENS.interface, this.deployer);
    this.variables = {};
  }

  async prepareNameRegistration(domain : string) {
    this.registrarAddress = await this.ens.owner(utils.namehash(domain));
    this.resolverAddress = await this.ens.resolver(utils.namehash(domain));
  }
}

export default ENSRegistrarBase;
