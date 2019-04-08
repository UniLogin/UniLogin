import ENS from 'universal-login-contracts/build/ENS.json';
import {providers, Contract, Wallet, utils, ContractFunction} from 'ethers';
import {Config} from 'universal-login-commons';

class ENSRegistrarBase {
  private readonly deployer : Wallet;
  private ens : Contract;
  private variables : object;
  private registrarAddress: ContractFunction | any;
  private resolverAddress: ContractFunction | any;

  constructor(private config : Config , private readonly provider : providers.Provider, private log = console.log) {
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
