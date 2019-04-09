import ENS from '@universal-login/contracts/build/ENS.json';
import {providers, Contract, Wallet, utils, ContractFunction} from 'ethers';
import {Config} from '@universal-login/commons';

class ENSRegistrarBase {
  protected readonly deployer : Wallet;
  protected ens : Contract;
  protected variables : Record<string, string>;
  protected registrarAddress: ContractFunction | any;
  protected resolverAddress: ContractFunction | any;

  constructor(protected config : Config , protected readonly provider : providers.Provider, protected log = console.log) {
    this.provider = provider || new providers.JsonRpcProvider(config.jsonRpcUrl, config.chainSpec);
    this.deployer = new Wallet(config.privateKey as string, this.provider);
    this.ens = new Contract(config.chainSpec.ensAddress as string, ENS.interface, this.deployer);
    this.config = config;
    this.variables = {};
    this.log = log;
  }

  async prepareNameRegistration(domain : string) {
    this.registrarAddress = await this.ens.owner(utils.namehash(domain));
    this.resolverAddress = await this.ens.resolver(utils.namehash(domain));
  }
}

export default ENSRegistrarBase;
